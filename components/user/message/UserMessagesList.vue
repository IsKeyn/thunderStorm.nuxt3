<script setup>
import SimpleCard from '@/components/user/cards/SimpleCard.vue';
import MessageListCard from '@/components/user/message/MessageListCard.vue';

import { computed, onMounted, ref } from "vue";

const { subscribe, unsubscribe } = useWebSocket();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

const props = defineProps({
	userForMessage: {
		type: Object,
		default: null,
	},
});

const propsUserForMessage = ref(props.userForMessage);

const requestName = 'getUserMessages';
const hiddenRefresh = ref(false);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(
							'auth/message/get-chats',
							'GET',
							{ companionId: propsUserForMessage.value?.id || null },
							requestName
					)
			);

			hiddenRefresh.value = false;
			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const hideUpdate = () => {
	hiddenRefresh.value = true;
	refresh();
}

const fetchedData = ref([]);
const selectedUserId = ref(null);

watch(() => requestData.value, (newValue) => {
	// Проверка на пустые данные
	if (!newValue || !Array.isArray(newValue)) {
		return;
	}

	fetchedData.value = JSON.parse(JSON.stringify(newValue));

	// Логика выбора пользователя
	if (propsUserForMessage.value) {
		const foundChat = fetchedData.value.find(item => item?.companion?.id === propsUserForMessage.value?.id);

		if (foundChat) {
			selectedUserId.value = foundChat.companion.id;
		} else {
			fetchedData.value.unshift({
				companion: propsUserForMessage.value,
				messages: [],
				chat: null,
			});

			selectedUserId.value = propsUserForMessage.value.id;
		}
	} else if (fetchedData.value[0]?.companion) {
		selectedUserId.value = fetchedData.value[0].companion.id;
	}

	propsUserForMessage.value = null;
});

const currentChatId = computed(() => {
	for (let key in fetchedData.value) {
		if (fetchedData.value[key]?.companion?.id === selectedUserId.value && fetchedData.value[key]?.chat) {
			return fetchedData.value[key].chat.id;
		}
	}
});

const chatKey = computed(() => {
	for (let key in fetchedData.value) {
		if (fetchedData.value[key]?.chat?.id === currentChatId.value) {
			return key;
		}
	}
});

const currentChat = computed(() => {
	if (chatKey.value !== null && chatKey.value !== undefined) {
		return fetchedData.value[chatKey.value]?.chat;
	}
});

const selectedUserMessages = computed(() => {
		for (let key in fetchedData.value) {
			if (fetchedData.value[key]?.companion?.id === selectedUserId.value) {
				return fetchedData.value[key]?.messages;
			}
		}
});

const selectedUserCompanion = computed(() => {
	for (let key in fetchedData.value) {
		if (fetchedData.value[key]?.companion?.id === selectedUserId.value) {
			return fetchedData.value[key]?.companion;
		}
	}
});

const setSelectedUser = (id) => {
	selectedUserId.value = id;

	if (chatKey.value !== null && chatKey.value !== undefined && !fetchedData.value[chatKey.value]?.messages?.length) {
		fetchOlderMessages();
	}

	togeShowedElement();
}

const fetchOlderMessages = async () => {
	if (!currentChatId.value) return;

	const body = {
		chat_id: currentChatId.value,
		first_message_id: fetchedData.value[chatKey.value]?.messages?.[0]?.id,
	};

	const response = await Promise.resolve(
			sendApiRequest('auth/message/get-messages', 'GET', body, 'fetchOlderMessages')
	);

	if (response?.data?.length) {
		if (fetchedData.value[chatKey.value].messages) {
			fetchedData.value[chatKey.value].messages = [...response.data, ...fetchedData.value[chatKey.value].messages];
		} else {
			fetchedData.value[chatKey.value].messages = [...response.data];
		}
	}
}

const userTypingName = ref('');
const userTypingTimeout = ref(null);
const typingRequestAwaiting = ref(false);

// Получение сообщений через WebSocked
onMounted(() => {
	if (hasWebSocked() && isAuth.value) {
		subscribe(
				`App.Models.User.${userStore.user.id}`,
				'Messenger.NewMessage',
				(data) => setNewMessage(data),
		);

		subscribe(
				`App.Models.User.${userStore.user.id}`,
				'Messenger.Typing',
				(data) => {
					if (data.chat.id === currentChatId.value) {
						userTypingName.value = data.companion.name;

						if (userTypingTimeout.value) {
							clearTimeout(userTypingTimeout.value);
						}

						userTypingTimeout.value = setTimeout(() => {
							userTypingName.value = '';
						}, 1000)
					}
				},
		);

		subscribe(
				`App.Models.User.${userStore.user.id}`,
				'Messenger.LastReadCompanionMessage',
				(data) => {
					if (data.chat_id === currentChatId.value) {
						fetchedData.value[chatKey.value].companion_last_read_message_id = data.last_message_id;
					}
				},
		);
	}
});

const setNewMessage = (data) => {
	for (let key in fetchedData.value) {
		if (fetchedData.value[key].chat.id === data.chat.id) {
			if (!fetchedData.value[key].messages) {
				fetchedData.value[key].messages = [];
			}

			fetchedData.value[key].messages.push(data.message);
			fetchedData.value[key].unread_count++;
			return;
		}
	}

	fetchedData.value.unshift({
		chat: data.chat,
		companion: data.companion,
		messages: [ data.message ],
		unread_count: 1,
	});
};

const isTyping = async () => {
	if (typingRequestAwaiting.value) return;
	if (!currentChatId.value) return;

	typingRequestAwaiting.value = true;

	try {
		sendApiRequest('auth/message/typing', 'POST', { chat_id: currentChatId.value });
		setTimeout(() => {
			typingRequestAwaiting.value = false;
		}, 1000);
	} catch (e) {
		error(e);
		typingRequestAwaiting.value = false;
	}
}

const setLastReadMessage = (messageId) => {
	if (chatKey.value !== null && chatKey.value !== undefined) {
		fetchedData.value[chatKey.value].chat.pivot.last_read_message_id = messageId;
		fetchedData.value[chatKey.value].unread_count = 0;
	}
}

// Переключение для мобилок
const elementForShow = ref('show-messages');

const togeShowedElement = () => {
	if (elementForShow.value === 'show-messages') {
		elementForShow.value = 'show-user-list';
		return;
	}

	if (elementForShow.value === 'show-user-list') {
		elementForShow.value = 'show-messages';
		return;
	}
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<template v-else-if="fetchedData && fetchedData.length">
		<button
				class="btn btn-simple-1 toggle-button"
				@click="togeShowedElement()"
		>
			<font-awesome-icon icon="fa-solid fa-arrow-right-arrow-left" class="mr-2" />
			<template v-if="elementForShow === 'show-user-list'">
				Показать сообщения
			</template>
			<template v-if="elementForShow === 'show-messages'">
				Показать пользователей
			</template>
		</button>
		<div class="message-box">
			<div
					v-if="fetchedData"
					:class="['user-list', elementForShow]"
			>
				<div v-for="(chat, key) in fetchedData" :key="key">
					<SimpleCard
							v-if="chat.companion"
							:user="chat.companion"
							:class="['mb-3', selectedUserId === chat.companion.id ? 'active' : '']"
							:counterValue="chat.unread_count"
							@parentFunction="setSelectedUser"
					/>
				</div>
			</div>
			<div :class="['message-list', elementForShow]">
				<MessageListCard
						:selectedUserId="selectedUserId"
						:messages="selectedUserMessages"
						:chat="currentChat"
						:companion_last_read_message_id="fetchedData?.[chatKey]?.companion_last_read_message_id"
						:userTypingName="userTypingName"
						@isTyping="isTyping"
						@fetchMessage="hideUpdate"
						@fetchOlderMessages="fetchOlderMessages"
						@setLastReadMessage="setLastReadMessage"
				/>
			</div>
		</div>
	</template>
	<ui-itemBox
			v-else
			classes="red"
			message="История игр отсутствует"
	/>
</template>

<style lang="scss" scoped>
.toggle-button {
	@apply block lg:hidden;
}

.message-box {
	@apply flex gap-3;

	.user-list {
		@apply hidden min-w-[200px];

		&.show-user-list {
			@apply block lg:block;
		}

		&.show-messages {
			@apply hidden lg:block;
		}
	}

	.message-list {
		@apply h-full w-full pl-3 lg:border-l lg:border-[--main-border-color];

		&.show-user-list {
			@apply hidden lg:block;
		}

		&.show-messages {
			@apply block lg:block;
		}
	}
}
</style>
