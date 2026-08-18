<script setup>
import OrganizersAndGratitude from '@/modules/boardGame/components/user/OrganizersAndGratitude.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const pageName = 'Организаторы и благодарности';
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
	<OrganizersAndGratitude />
</template>

<style lang="scss" scoped />
