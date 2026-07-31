<script setup>
import SendMessageForm from '@/components/user/message/SendMessageForm.vue';

import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['fetchMessage', 'fetchOlderMessages', 'isTyping', 'setLastReadMessage']);

import { userFunctions } from '@/composables/userFunctions.js';
const { userStore } = userFunctions();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	selectedUserId: {
		type: Number,
		default: null,
	},
	messages: {
		type: Object,
		required: true,
	},
	chat: {
		type: Object,
	},
	userTypingName: {
		type: String,
		default: '',
	},
	companion_last_read_message_id: {
		type: Number,
		default: null,
	},
});

const messagesContainer = ref(null);
const isLoading = ref(false);
let observer = null;

const scrollToBottom = () => {
	nextTick(() => {
		if (messagesContainer.value) {
			messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
		}
	});
};

const setupObserver = () => {
	if (observer) {
		observer.disconnect();
		observer = null;
	}

	const container = messagesContainer.value;
	if (!container) return;

	const children = container.children;
	if (children.length === 0) return;

	// Наблюдаем за 3-м элементом сверху (индекс 2)
	const targetIndex = Math.min(2, children.length - 1);
	const target = children[targetIndex];

	observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isLoading.value) {
						isLoading.value = true;
						emit('fetchOlderMessages');
					}
				});
			},
			{
				root: container,
				threshold: 0.1,
			}
	);

	observer.observe(target);
};

onMounted(() => {
	scrollToBottom();
	setupObserver();
});

onBeforeUnmount(() => {
	if (observer) {
		observer.disconnect();
	}
});

watch(
		() => props.messages,
		() => {
			const container = messagesContainer.value;

			if (isLoading.value && container) {
				// Сохраняем позицию скролла при подгрузке старых сообщений
				const oldScrollHeight = container.scrollHeight;
				nextTick(() => {
					const newScrollHeight = container.scrollHeight;
					container.scrollTop = newScrollHeight - oldScrollHeight;
					isLoading.value = false;
					setupObserver();
				});
			} else {
				// Скроллим вниз при новых сообщениях
				scrollToBottom();
				nextTick(() => setupObserver());
			}
		},
		{ deep: true }
);

watch(
		() => props.selectedUserId,
		() => {
			isLoading.value = false;
			scrollToBottom();
			nextTick(() => setupObserver());
		}
);

// Отмечаем сообщение как прочитанное
const setMessageAsRead = async (chatId, messageId) => {
	const body = {
		chat_id: chatId,
		message_id: messageId,
	};

	const response = await sendApiRequest('auth/message/set-message-as-read', 'POST', body, 'setMessageAsRead', '');
console.log('setMessageAsRead');
	emit('setLastReadMessage', response.last_read_message_id)
}

watch(() => props.messages, () => {
	if (props.messages) {
		if (props.chat?.pivot?.last_read_message_id) {
			if (props.messages[props.messages.length - 1]?.id > props.chat.pivot.last_read_message_id) {
				setMessageAsRead(props.chat.id, props.messages[props.messages.length - 1]?.id);
			}
		} else if (props.chat?.pivot?.last_read_message_id === null) {
			setMessageAsRead(props.chat.id, props.messages[props.messages.length - 1]?.id);
		}
	}
}, { deep: true, immediate: true })
</script>

<template>
	<div class="messages-parent-box">
		<div class="message-list">
			<div class="messages-container" ref="messagesContainer">
				<div
						v-for="(message, key) in messages"
						:key="key"
						:class="['message', userStore.user.id === message.user_id ? 'to' : 'from']"
				>
					<div class="wrapper">
						<span class="message-text">{{ message.body }}</span>
						<span class="message-footer">
							{{ getFormattedDate('d ru_mouths_name Y H:i', message.created_at) }}
							<span class="status-message">
								<font-awesome-icon v-if="companion_last_read_message_id < message.id" icon="fa-solid fa-check" />
								<font-awesome-icon v-else icon="fa-solid fa-check-double" />
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4">
			<small v-show="userTypingName" class="block mb-2">{{ userTypingName }} печатает...</small>
			<SendMessageForm
					:selectedUserId="selectedUserId"
					@fetchMessage="$emit('fetchMessage', $event)"
					@isTyping="$emit('isTyping')"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.messages-parent-box {
	.message-list {
		@apply flex flex-col w-full overflow-hidden;
		height: calc(100vh - 350px);

		.messages-container {
			@apply flex-1 flex flex-col overflow-y-auto;

			.message:first-child {
				@apply mt-auto;
			}
		}

		.message {
			@apply flex justify-between items-end;

			&.to {
				@apply justify-end;

				.wrapper {
					@apply bg-[var(--third-block-color)];
				}
			}

			&.from {
				@apply justify-start;

				.wrapper {
					@apply bg-[var(--second-block-color)];

					.message-footer {
						.status-message {
							@apply hidden;
						}
					}
				}
			}

			.wrapper {
				@apply w-[70%] p-2 mb-2 text-[var(--main-dark-text-color)];

				.message-text {
					@apply block pt-1;
				}

				.message-footer {
					@apply block text-right text-[0.8rem];
				}
			}
		}
	}
}
</style>
