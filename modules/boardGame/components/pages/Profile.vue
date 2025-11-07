<script setup>
import PlayerProfile from '@/modules/boardGame/components/user/player/PlayerProfile.vue';

import { computed } from 'vue'

const route = useRoute();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

const nameForProfile = computed(() => {
	if (route.params.name) {
		return route.params.name;
	} else if (isAuth) {
		return userStore.user.name;
	}
});

const breadCrumbsArray = computed(() => {
	const splitPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo?.name,
			href: `/${splitPath[1]}/${splitPath[2]}`,
		},
		{
			name: nameForProfile,
			href: `/${splitPath[1]}/${splitPath[2]}/${splitPath[3]}`,
		},
	];
});
</script>

<template>
	<layout-PageHeader
			title="Профайл"
			:breadCrumbs="breadCrumbsArray"
			:showMainPageInBreadCrumbs="false"
	/>
	<PlayerProfile
			:userName="nameForProfile"
	/>
</template>
