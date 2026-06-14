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
			user_id: {
				name: 'Пользователь',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			bg_player_id: {
				name: 'ID игрока',
				type: 'text',
				sortable: true,
			},
			board_game_id: {
				name: 'Настольная игра',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				sortable: true,
			},
			board_game_item_id: {
				name: 'ID привязки предмета',
				sortable: true,
				type: 'rounded-box',
			},
			has_used: {
				name: 'Был использован',
				type: 'boolean',
				sortable: true,
			},
		}
);

const pageType = ref('');

const title = 'Инвентарь игроков в настолке';
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
			v-if="checkPermission('bg.player-inventory.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/Inventory"
			entity="BoardGame"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/Inventory/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
