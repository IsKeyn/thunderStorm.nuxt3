<script setup>
import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

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

const requestName = 'boardGamePlayerInfoRequest';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (userStore.user && Object.keys(userStore.user).length > 0 && route.params.slug) {
				let request = `${apiUrl.value}board-game/v2/player/current/${route.params.slug}`;

				const query = {};
				const sessionCookie = useCookie(sessionCookieName.value);

				try {
					loadState.loadList[requestName] = {
						name: requestName,
						type: 'useAsyncData',
						preloaderType: 'fullscreen',
						status: 'load',
					};

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

					if (response && response?.data) {
						userStore.player = response.data;
						if (loadState.loadList[requestName]) {
							loadState.loadList[requestName].status = 'finish';
						}
					}
				} catch (e) {
					if (loadState.loadList[requestName]) {
						loadState.loadList[requestName].status = 'error';
					}
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
