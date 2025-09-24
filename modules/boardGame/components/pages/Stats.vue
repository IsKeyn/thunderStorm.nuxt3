<script setup>
import StatsList from '@/modules/boardGame/components/stats/StatsList.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const route = useRoute();

const pageName = 'Статистика';
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
	/>
	<StatsList
			:boardGameId="boardGameStore.boardGameInfo.id"
	/>
</template>
