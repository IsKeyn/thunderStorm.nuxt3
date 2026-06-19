<script setup>
import PlayersList from '@/modules/boardGame/components/user/player/PlayersList.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const pageName = 'Список участников';
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

const usedFilters = [
	{
		name: 'twitchStreamOnline',
		langName: 'Стрим онлайн',
		type: 'checkbox',
	},
	{
		name: 'only_inactive',
		langName: 'Показать не активных',
		type: 'checkbox',
	},
];

const sortOptions = [
	{
		name: 'По месту',
		value: 'place',
	},
	// {
	// 	name: 'По количеству очков',
	// 	value: 'full_points',
	// },
	{
		name: 'По соотношению очки/время',
		value: 'points_per_hour',
	},
	{
		name: 'Никнейму',
		value: 'name',
	},
	{
		name: 'Дата регистрации',
		value: 'created_at',
	},
	{
		name: 'Последней активности',
		value: 'updated_at',
	},
];

const defaultFilters = {
	sort: {
		field: "place",
		sort: "asc",
	},
}
</script>

<template>
	<layout-PageHeader
			:title="pageName"
			:breadCrumbs="breadCrumbsArray"
			:showMainPageInBreadCrumbs="false"
	/>
	<PlayersList
			entity="BoardGamePlayer"
			:usedFilters="usedFilters"
			:sortOptions="sortOptions"
			:defaultFilters="defaultFilters"
	/>
</template>
