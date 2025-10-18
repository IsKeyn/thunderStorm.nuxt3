<script setup>
const route = useRoute();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const requestName = 'boardGameCurrentPlayerInfoRequest';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (
					userStore.user
					&& Object.keys(userStore.user).length > 0
					&& (Object.keys(userStore.player).length === 0 || userStore.player.user_id !== userStore.user.id)
			) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/current/${route.params.slug}`, 'GET', {}, requestName, 'small')
				);

				if (response && response?.data) {
					userStore.player = response.data;
				}
			}
		},
		{
			// server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

watch(() => route.params.slug, (newSlug) => {
	if (newSlug) {
		refresh();
	}
});

watch(() => userStore.user, () => {
	if (
			userStore.user
			&& Object.keys(userStore.user).length > 0
			&& (Object.keys(userStore.player).length === 0 || userStore.player.user_id !== userStore.user.id)
	) {
		refresh();
	}
}, { deep: true });
</script>

<template />
