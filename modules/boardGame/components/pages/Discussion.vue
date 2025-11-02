<script setup>
const route = useRoute();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: 'Обсуждение',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<layout-PageHeader
			title="Обсуждение"
			:breadCrumbs="breadCrumbsArray"
	/>
	<Comments
			entityType="App\Models\BoardGame"
			:entityId="boardGameStore.boardGameInfo.id"
			:showAnswer="true"
	/>
</template>
