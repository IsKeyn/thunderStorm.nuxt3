<script setup>
import List from '@/components/entity/List.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue, boardGameStore } = boardGame();

const props = defineProps({
	showHeader: {
		type: Boolean,
		default: true,
	},
});

const defaultEventGamePlatforms = [
	{
		id:	25,
		name:	"Nintendo Entertainment System (NES)",
		active: true,
	},
	{
		id: 26,
		name: "Sega Mega Drive",
		active: true,
	},
	{
		id: 27,
		name: "Super Nintendo Entertainment System",
		active: true,
	},
	{
		id: 1,
		name: "PlayStation",
		active: true,
	},
	{
		id: 33,
		name: "Dreamcast",
		active: true,
	},
	{
		id: 14,
		name: "Мобильные телефоны/Java",
		active: true,
	},
	{
		id: 4,
		name: "PC Windows",
		active: true,
	},
];

const gamePlatformsOptions = computed(() => {
	return getSettingValue('eventGamePlatforms') ? JSON.parse(getSettingValue('eventGamePlatforms')) : defaultEventGamePlatforms;
});

const usedFilters = [
	{
		name: 'minMaxData',
		langName: 'Дата выхода',
		requestData: true,
	},
	{
		name: 'eventGamePlatforms',
		langName: 'Игровые платформы',
		type: 'multiselect',
		parse: true,
		options: gamePlatformsOptions.value,
	},
	{
		name: 'genres',
		langName: 'Жанры',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'companies',
		langName: 'Компании',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'series',
		langName: 'Серия',
		type: 'multiselect',
		requestData: true,
		parse: true,
	},
	{
		name: 'events',
		langName: 'Ивенты',
		type: 'hidden',
		requestData: true,
		parse: true,
	},
	{
		name: 'onlyGold',
		langName: 'Только золотая коллекция',
		type: 'checkbox',
	},
	{
		name: 'tags',
		langName: 'Теги',
		type: 'curtained',
		requestData: true,
	},
];

const sortOptions = [
	{
		name: 'Сортировка',
		value: 'sort',
	},
	{
		name: 'Название',
		value: 'name',
	},
	{
		name: 'Лайки',
		value: 'likes',
	},
	{
		name: 'Просмотры',
		value: 'views',
	},
	{
		name: 'Дата релиза',
		value: 'date',
	},
	{
		name: 'Дата публикации',
		value: 'created_at',
	},
];

const defaultFilters = {
	events: [
		boardGameStore.boardGameInfo.id
	],
};
</script>

<template>
	<List
			:showHeader="showHeader"
			entity="game"
			:pathToDetail="`e/${route.params.slug}/game`"
			name="Игры"
			title="Игры"
			:usedFilters="usedFilters"
			:sortOptions="sortOptions"
			:defaultFilters="defaultFilters"
	/>
</template>
