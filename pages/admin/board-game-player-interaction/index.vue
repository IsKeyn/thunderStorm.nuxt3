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
			type: {
				name: 'Тип',
				sortable: true,
				type: 'rounded-box',
			},
			status: {
				name: 'Статус',
				sortable: true,
			},
			description: {
				name: 'Описание',
				type: 'cutText',
			},
			board_game_id: {
				name: 'ID настолькой игры',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				sortable: true,
			},
			bg_player_id: {
				name: 'ID игрока',
				type: 'text',
				sortable: true,
			},
			with_player: {
				name: 'С игроков',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			created_by: {
				name: 'created_by',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			entity_type: {
				name: 'Модель',
				sortable: true,
			},
			entity_id: {
				name: 'id элемента',
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

const title = 'Взаимодействия игроков';
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
			v-if="checkPermission('bg.player-interaction.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/PlayerInteraction"
			entity="PlayerInteractions"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/PlayerInteraction/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
