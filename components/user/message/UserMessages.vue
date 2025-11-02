<script setup>
import UserMessagesModal from '@/components/user/messages/UserMessagesModal.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userMessage } from '@/composables/userMessage.js';
const {
	userMessagesModalRef,
	getUserMessageCount,
} = userMessage();

import { onMounted } from 'vue'

onMounted(() => {
	if (Object.keys(userStore.user).length > 0) {
		getUserMessageCount();

		setInterval(() => {
			getUserMessageCount();
		}, 10000);
	}
})
</script>

<template>
	<UserMessagesModal ref="userMessagesModalRef" />
</template>
