<script setup>
import { computed, onMounted } from "vue";

const { subscribe, unsubscribe } = useWebSocket();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useTwitchStore } from '@/stores/twitch';
const twitchStore = useTwitchStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

const requestName = 'get_bg_layout_data_' + route.params.slug;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (route.params.slug) {
				const query = {
					slug: route.params.slug,
				};

				const requestUrl = 'board-game/v2/layout/get';

				const response = await Promise.resolve(
						sendApiRequest(requestUrl, 'GET', query, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const setOnlineStreamers = (streamers) => {
	twitchStore.streamersOnline = streamers;

	const playersOnline = {};

	streamers.forEach((streamer) => {
		if (
				streamer.board_games_list
				&& streamer.board_games_list.length
		) {
			streamer.board_games_list.forEach((boardGame) => {
				if (boardGame.slug === route.params.slug) {
					playersOnline[streamer.site_user_id] = streamer.user_name;
				}
			});
		}
	});

	boardGameStore.playersOnline = playersOnline;
}

watch(() => requestData.value, (newData) => {
	if (newData) {
		if (newData.twitchOnline) {
			setOnlineStreamers(newData.twitchOnline);
		}

		if (newData.boardGame) {
			boardGameStore.boardGameInfo = newData.boardGame;
		}

		if (newData.player) {
			userStore.player = newData.player;
		}
	}
}, { immediate: true })

// ОБНОВЛЯЕМ ДАННЫЕ, при переходе между 2-ми ивентами
watch(() => route.params.slug, (newSlug) => {
	if (newSlug) {
		refresh();
	}
});

// ОБНОВЛЯЕМ ДАННЫЕ, если пользователь авторизовался, чтобы получить данные игрока
watch(() => userStore.user, () => {
	if (userStore.user && Object.keys(userStore.user).length) {
		refresh();

		subscribe(
				`bgPlayer.${route.params.slug}.${userStore.user.id}`,
				'PlayerData',
				(data) => {
					userStore.player = data;
				},
		);
	}
}, { deep: true });

onMounted(() => {
	/* Если подключен WebSocked */
	if (hasWebSocked()) {
		subscribe(
				'TwitchOnlineStreamers',
				'TwitchOnlineStreamers',
				(data) => {
					setOnlineStreamers(data);
				},
				'public'
		);

		if (userStore.user && Object.keys(userStore.user).length) {
			subscribe(
					`bgPlayer.${route.params.slug}.${userStore.user.id}`,
					'PlayerData',
					(data) => {
						userStore.player = data;
					},
			);
		}
	} else {
		setInterval(() => {
			refresh();
		}, 300000);
	}
});
</script>

<template />
<style lang="scss" scoped />
