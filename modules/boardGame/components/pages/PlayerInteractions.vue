<script setup>
import PlayerInteractionsList from '@/modules/boardGame/components/player-interactions/PlayerInteractionsList.vue';

import { useUserStore } from '@/stores/user';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

const pageName = 'Взаимодействия с игроками';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo?.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: pageName,
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<layout-PageHeader
			:title="pageName"
			:breadCrumbs="breadCrumbsArray"
			:showMainPageInBreadCrumbs="false"
	/>

	<PlayerInteractionsList
			v-if="isAuth"
			:user_id="userStore.user.id"
			:active="true"
			:listenUpdates="true"
	/>
	<div
			v-else
			class="item-box"
	>
		Функционал доступен только авторизованному пользователю
	</div>
</template>
