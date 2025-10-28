<script setup>
import MainStepsComponent from '@/modules/boardGame/components/steps/MainStepsComponent.vue';

const route = useRoute();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const pageName = ref('Главная');

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo?.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});

const setPageName = (name) => {
	pageName.value = name;
}
</script>

<template>
	<layout-PageHeader
			:title="pageName"
			:breadCrumbs="breadCrumbsArray"

	/>
	<MainStepsComponent @setPageName="setPageName($event)" />
</template>
