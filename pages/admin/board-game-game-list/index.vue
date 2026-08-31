<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import ListTableV2 from '@/components/admin/list/ListTableV2.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { roles } from '@/composables/roles.js';
const { checkPermission } = roles();

const titles = ref(
		{
			id: {
				name: 'id',
				sortable: true,
				type: 'rounded-box',
			},
			game_id: {
				name: 'Игра',
				type: 'EntityList',
				apiUrl: 'game/getShortList?fullList=true',
				sortable: true,
			},
			gaming_platform_id: {
				name: 'Платформа',
				type: 'EntityList',
				apiUrl: 'gaming-platform/getShortList?fullList=true',
				sortable: true,
			},
			description: {
				name: 'Описание',
				type: 'cutText',
			},
			board_game_id: {
				name: 'Ивент',
				type: 'EntityList',
				apiUrl: 'board-game/getShortList?fullList=true',
				sortable: true,
			},
			points: {
				name: 'Количество очков за игру',
				sortable: true,
				type: 'rounded-box',
			},
			difficult: {
				name: 'Сложность в процентах',
				sortable: true,
				type: 'rounded-box',
			},
			game_completion_time: {
				name: 'Время на прохождение (в минутах)',
				sortable: true,
				type: 'rounded-box',
			},
			coop: {
				name: 'Кооп',
				type: 'boolean',
				sortable: true,
			},
			list_type: {
				name: 'Тип списка',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			source: {
				name: 'Источник',
				type: 'cutText',
				sortable: true,
			},
			added_by: {
				name: 'Кто добавил',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			created_by: {
				name: 'Кто создал',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
		}
);


const pageType = ref('');

const title = 'Список игр в настолке';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: 'Админ панель',
			href: `/${splitedPath[1]}`,
		},
		{
			name: title,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});

const defaultFilters = {
	sort: {
		field: "id",
		sort: "desc",
	},
}

const sortOptions = [
	{
		name: 'id',
		value: 'id',
	},
	{
		name: 'Сортировка',
		value: 'sort',
	},
	{
		name: 'Название',
		value: 'name',
	},
];

const usedFilters = [
	{
		name: 'onlyTrashed',
		langName: 'Только удаленные',
		type: 'checkbox',
	},
	{
		name: 'tags',
		langName: 'Теги',
		type: 'curtained',
		requestData: true,
	},
];
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<ListTableV2
			v-if="checkPermission('bg.game-list.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/GameList"
			entity="BoardGameGameList"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/GameList/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
