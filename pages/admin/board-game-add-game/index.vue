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
			bg_player_id: {
				name: 'ID игрока',
				type: 'text',
				sortable: true,
			},
			user_id: {
				name: 'ID пользователя',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			board_game_id: {
				name: 'Ивент',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				sortable: true,
			},
			name: {
				name: 'Название',
				sortable: true,
			},
			gaming_platform_id: {
				name: 'Платформа',
				type: 'EntityList',
				apiUrl: 'admin/entity/GamingPlatform',
				sortable: true,
			},
			coop: {
				name: 'Кооп',
				type: 'boolean',
				sortable: true,
			},
			game_completion_time: {
				name: 'Время на прохождение (в минутах)',
				sortable: true,
				type: 'rounded-box',
			},
			difficulty: {
				name: 'Сложность в процентах',
				sortable: true,
				type: 'rounded-box',
			},
			description: {
				name: 'Описание',
				type: 'cutText',
			},
			status: {
				name: 'Текущий статус',
				sortable: true,
				type: 'rounded-box',
			},
			sort: {
				name: 'Сортировка',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
		}
);

const pageType = ref('');

const title = 'Игры добавляемые игроками';
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
			v-if="checkPermission('bg.add-game.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/AddGame"
			entity="BoardGame"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/AddGame/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
