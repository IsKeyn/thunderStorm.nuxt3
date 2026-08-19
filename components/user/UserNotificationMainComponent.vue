<script setup>
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';
import UserMessagesModal from '@/components/user/message/UserMessagesModal.vue';

import { onMounted } from 'vue'

const runtimeConfig = useRuntimeConfig();

const { subscribe, unsubscribe } = useWebSocket();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userNotificationMain } from '@/composables/userNotificationMain.js';
const {
	userNotificationModalRef,
	userMessagesModalRef,
	getAllNotifications,
	setUserNotification,
} = userNotificationMain();

onMounted(async () => {
	if (Object.keys(userStore.user).length) {
		getAllNotifications();

		if (runtimeConfig.public.hasWebSockedServer) {
			const userId = userStore.user?.id;

			const { unsubscribe: stop, subscriptionId } = subscribe(
					`App.Models.User.${userId}`,
					'NotificationCount',
					(data) => {
						setUserNotification(data);
					}
			);
		} else {
			setInterval(() => {
				getAllNotifications();
			}, 10000);
		}
	}
});
</script>

<template>
	<div>
		<UserNotificationModal ref="userNotificationModalRef" />
		<UserMessagesModal ref="userMessagesModalRef" />
	</div>
</template>
