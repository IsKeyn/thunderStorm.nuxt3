<script setup>
import PlayersList from '@/modules/boardGame/components/user/player/PlayersList.vue';

const emit = defineEmits(['onClickFunc']);

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	filterNamePostfix: {
		type: String,
		default: 'players_default',
	},
	showPageHeader: {
		type: Boolean,
		default: true,
	},
	defaultFiltersProp: {
		type: Object,
		default: {},
	},
	usedFiltersProp: {
		type: Object,
		default: [],
	},
	showPagination: {
		type: Boolean,
		default: true,
	},
	showFilters: {
		type: Boolean,
		default: true,
	},
	/* Действие при нажатии route, emit */
	clickDoType: {
		type: String,
		default: 'route',
	},
	/* Отображать блок выбора случайного игрока */
	showSelectRandomPlayer: {
		type: Boolean,
		default: false,
	},
});

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
		name: 'По позиции на поле',
		value: 'position',
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
			v-if="showPageHeader"
			:title="pageName"
			:breadCrumbs="breadCrumbsArray"
			:showMainPageInBreadCrumbs="false"
	/>
	<PlayersList
			entity="BoardGamePlayer"
			:filterNamePostfix="filterNamePostfix"
			:usedFilters="[ ...usedFilters, ...usedFiltersProp ]"
			:sortOptions="sortOptions"
			:defaultFilters="{ ...defaultFilters, ...defaultFiltersProp }"
			:showPagination="showPagination"
			:showFilters="showFilters"
			:clickDoType="clickDoType"
			:showSelectRandomPlayer="showSelectRandomPlayer"
			@onClickFunc="$emit('onClickFunc', $event)"
	/>
</template>
