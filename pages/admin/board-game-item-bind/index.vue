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
			item_id: {
				name: 'Предмет',
				type: 'EntityList',
				apiUrl: 'board-game/v2/item/list',
				sortable: true,
			},
			board_game_id: {
				name: 'ID настолькой игры',
				type: 'EntityList',
				apiUrl: 'board-game/getShortList?fullList=true',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			created_by: {
				name: 'Создан кем',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
		}
);


const pageType = ref('');

const title = 'Привязка предметов к настолке';
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
			v-if="checkPermission('bg.item-bind.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/itemBind"
			entity="BoardGame"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/itemBind/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
