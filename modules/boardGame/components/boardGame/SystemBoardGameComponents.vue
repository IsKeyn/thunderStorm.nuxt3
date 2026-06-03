<script setup>
// TODO устаревший компонент, удалить, когда нигде не будет использоваться
const route = useRoute();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

const requestName = 'boardGameShortInfoRequest';

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			// Проверяем наличие slug перед выполнением запроса
			let request = `${apiUrl.value}board-game/v2/get/${route.params.slug}`;

			const query = {
				type: 'short',
			};
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

				if (!response) {
					throw showError({
						statusCode: 404,
						message: 'Игра не найдены'
					});
				} else {
					if (loadState.loadList[requestName]) {
						loadState.loadList[requestName].status = 'finish';
					}

					if (response && response.data) {
						boardGameStore.boardGameInfo = response.data;
						return response.data;
					}
				}
			} catch (e) {
				if (loadState.loadList[requestName]) {
					loadState.loadList[requestName].status = 'error';
				}
				errorHandler(e);
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

const fetchedData = computed(() => requestData.value || null);

watch(() => route.params.slug, (newSlug) => {
	if (newSlug) {
		refresh();
	}
});
</script>

<template>

</template>
