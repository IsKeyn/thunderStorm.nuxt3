<script setup>
import UserNotificationCard from '@/components/user/notifications/UserNotificationCard.vue';

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

import { userNotification } from '@/composables/userNotification.js';
const {
	setUserNotification
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
									setUserNotification(fetchedData.value.filter((item) => !item.viewed).length);
								} else {
									error('request error', 5000);
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const updateData = () => {
	refresh();
}
</script>

<template>
	<div v-if="fetchedData.length > 0">
		<UserNotificationCard
				v-for="(item, key) in fetchedData"
				:key="key"
				:notification="item"
				@updateData="updateData"
		/>
	</div>
	<div v-else class="item-box">
		Оповещений нет
	</div>
</template>
