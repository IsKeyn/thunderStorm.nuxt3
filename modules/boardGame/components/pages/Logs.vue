<script setup>
import LogsList from '@/modules/boardGame/components/log-list/LogsList.vue';

const route = useRoute();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const pageName = 'Логи ивента';
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
	<LogsList />
</template>
