<script setup>
import PlayersList from '@/modules/boardGame/components/user/player/PlayersList.vue';

import { inject } from 'vue'
const boardGameInfo = inject('boardGameInfo')

const route = useRoute();

const pageName = 'Список игроков';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameInfo.value.name,
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
	<PlayersList
			:boardGameId="boardGameInfo.id"
	/>
</template>
