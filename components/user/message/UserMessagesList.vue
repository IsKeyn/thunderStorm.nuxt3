<script setup>
import UserNotificationCard from '@/components/user/notifications/UserNotificationCard.vue';
import SimpleCard from '@/components/user/cards/SimpleCard.vue';
import MessageListCard from '@/components/user/message/MessageListCard.vue';

const emit = defineEmits(['loadingToggle']);

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userMessage } from '@/composables/userMessage.js';
import {computed, onMounted, onUnmounted, ref} from "vue";
const {
	setUserNotificationMessageCount
} = userNotification();

const route = useRoute();
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
					sendApiRequest('auth/message/get', 'GET', {}, requestName, '')
			);

			emit('loadingToggle');
			hiddenRefresh.value = false;
			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const updateData = () => {
	refresh();
}

const selectedUserId = ref(null);

const selectedUserMessages = computed(() => {
	if (fetchedData.value) {
		if (!selectedUserId.value) {
			selectedUserId.value = fetchedData.value.users[0].id;
		}

		return fetchedData.value.messages[selectedUserId.value];
	}
});

const setSelectedUser = (id) => {
	selectedUserId.value = id;
}

const updateMessageData = ref(null);

onMounted(() => {
	updateMessageData.value = setInterval(() => {
		hiddenRefresh.value = true;
		updateData();
	}, 5000);
})

onUnmounted(() => {
	clearInterval(updateMessageData.value);
});
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress && !hiddenRefresh" />
	<template v-else-if="fetchedData && Object.keys(fetchedData).length > 0">
		<div class="message-box">
			<div
					v-if="fetchedData.users"
					class="user-list"
			>
				<SimpleCard
						v-for="(user, key) in fetchedData.users"
						:key="key"
						:user="user"
						class="mb-3"
						:classes="selectedUserId === user.id ? 'active' : ''"
						@parentFunction="setSelectedUser"
				/>
			</div>
			<div class="message-list">
				<MessageListCard :messages="selectedUserMessages" />
			</div>
		</div>
	</template>
	<template v-else>
		История игр отсутствует
	</template>
</template>

<style lang="scss" scoped>
.message-box {
	@apply flex gap-3;

	.user-list {
		@apply min-w-[200px];
	}

	.message-list {
		@apply h-full w-full pl-3;
		border-left: 1px solid var(--main-border-color);
	}
}
</style>
