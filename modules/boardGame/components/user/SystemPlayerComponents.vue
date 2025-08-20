<script setup>
import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const route = useRoute();

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		'boardGamePlayerInfoRequest',
		async () => {
			if (userStore.user && Object.keys(userStore.user).length > 0 && route.params.slug) {
				let request = `${apiUrl.value}board-game/v2/player/current/${route.params.slug}`;

				const query = {};
				const sessionCookie = useCookie(sessionCookieName.value);

				try {
					const response = await $fetch(
							request,
							{
								method: 'GET',
								credentials: 'include',
								query,
								headers: {
									Accept: 'application/json',
									Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
									Referer: publicUrl.value,
								}
							},
					);

					if (response && response?.date) {
						userStore.player = response.date;
					}
				} catch (e) {
					errorHandler(e);
				}
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);
</script>

<template />
