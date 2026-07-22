<script setup>
import GameListWithPagination from '@/modules/boardGame/components/game/GameListWithPagination.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const pageName = 'Игры в ивенте';
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
	<div class="max-w-[1400px] m-auto">
		<GameListWithPagination :showHeader="false" />
	</div>
</template>

<style lang="scss" scoped></style>
