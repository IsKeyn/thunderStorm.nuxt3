<script setup>
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';
import OtherPlayersActionsWithGame from '@/modules/boardGame/components/game/otherPlayersActionsWithGame/OtherPlayersActionsWithGame.vue';

import { computed } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const requestName = 'event_game_detail_' + route.params['game-slug'];

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/game/get/${route.params.slug}/${route.params.gameslug}`, 'GET', {}, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || []);

const pageName = '';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo?.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: 'Игры',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
		{
			name: fetchedData.value?.game?.name ? fetchedData.value.game.name : 'Игра',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<div>
		<layout-PageHeader
				:title="pageName"
				:breadCrumbs="breadCrumbsArray"
		/>
		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<div v-else-if="fetchedData">
			<GameCard
					:element="{ game: fetchedData }"
					theme="CurrentGame"
					:showStatusBar="false"
			/>
		</div>
		<ui-itemBox
				v-else
				classes="red"
				message="Данные не получены"
		/>

		<OtherPlayersActionsWithGame
				:eventSlug="route.params.slug"
				:gameSlug="route.params.gameslug"
		/>
	</div>
</template>
