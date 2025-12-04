<script setup>
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';
import UserMessagesModal from '@/components/user/message/UserMessagesModal.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userNotificationMain } from '@/composables/userNotificationMain.js';
const {
	userNotificationModalRef,
	userMessagesModalRef,
	getAllNotifications,
} = userNotificationMain();

import { onMounted } from 'vue'

onMounted(() => {
	if (Object.keys(userStore.user).length > 0) {
		getAllNotifications();

		setInterval(() => {
			getAllNotifications();
		}, 30000);
	}
})
</script>

<template>
	<UserNotificationModal ref="userNotificationModalRef" />
	<UserMessagesModal ref="userMessagesModalRef" />
</template>
