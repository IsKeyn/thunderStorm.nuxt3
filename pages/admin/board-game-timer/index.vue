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
			name: {
				name: 'Название',
				sortable: true,
			},
			slug: {
				name: 'Slug',
				sortable: true,
			},
			description: {
				name: 'Описание',
				type: 'cutText',
			},
			limit: {
				name: 'Лимит',
				sortable: true,
				type: 'rounded-box',
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			board_game_id: {
				name: 'ID настолькой игры',
				sortable: true,
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
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

const title = 'Таймеры';
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
	// {
	// 	name: 'boardGame',
	// 	langName: 'Ивент',
	// 	type: 'multiselect',
	// 	requestData: true,
	// },
];
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<ListTableV2
			v-if="checkPermission('bg.timer.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/timer"
			entity="timer"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/timer"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
