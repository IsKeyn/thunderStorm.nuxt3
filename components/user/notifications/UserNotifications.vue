<script setup>
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userNotification } from '@/composables/userNotification.js';
const {
	userNotificationModalRef,
	getUserNotifications,
} = userNotification();

import { onMounted } from 'vue'

onMounted(() => {
	if (Object.keys(userStore.user).length > 0) {
		getUserNotifications();

		setInterval(() => {
			getUserNotifications();
		}, 10000);
	}
})
</script>

<template>
	<UserNotificationModal ref="userNotificationModalRef" />
</template>
