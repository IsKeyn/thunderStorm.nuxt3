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
				name: 'Игрок',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			board_game_player_id: {
				name: 'ID игрока',
				type: 'text',
				sortable: true,
			},
			board_game_id: {
				name: 'Настольная игра',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				// classes: '!bg-[#004251eb]',
				sortable: true,
			},
			status_effect_id: {
				name: 'Статус эффект',
				type: 'EntityList',
				apiUrl: 'entity/getFields',
				body: {
					entity: 'App\\Models\\BoardGame\\StatusEffect',
				},
				hasResource: false,
				// classes: '!bg-[#004251eb]',
				sortable: true,
			},
			status_effect_bind_id: {
				name: 'ID привязки, привязанного статус эффекта',
				type: 'text',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			created_by: {
				name: 'Создан',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
		}
);

const pageType = ref('');

const title = 'Эффект статуса игрока';
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
			v-if="checkPermission('bg.status-effect-on-player.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/PlayerStatusEffect"
			entity="PlayerStatusEffect"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/PlayerStatusEffect/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
