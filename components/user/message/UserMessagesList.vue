<script setup>
import UserNotificationCard from '@/components/user/notifications/UserNotificationCard.vue';

const emit = defineEmits(['loadingToggle']);

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userMessage } from '@/composables/userMessage.js';
const {
	setUserNotificationMessageCount
} = userNotification();

const fetchedData = ref([]);
const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}auth/notification/get`;

			const query = {};

			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									fetchedData.value = response._data.data;
									setUserNotificationMessageCount(fetchedData.value.filter((item) => !item.viewed).length);
								} else {
									error('request error', 5000);
								}

								requestInProgress.value = false;
								emit('loadingToggle');
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
				emit('loadingToggle');
			}
		}
);

const updateData = () => {
	refresh();
}
</script>

<template>
	<div>
		123
	</div>
</template>
