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
				name: 'User ID',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			board_game_id: {
				name: 'ID настольной игры',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				sortable: true,
			},
			points: {
				name: 'Количество очков',
				sortable: true,
				type: 'rounded-box',
			},
			points_per_hour: {
				name: 'Очков в час',
				sortable: true,
				type: 'rounded-box',
			},
			item_roll_count: {
				name: 'Доступное количество ролов игры',
				sortable: true,
				type: 'rounded-box',
			},
			step_count: {
				name: 'Доступное количество ходов',
				sortable: true,
				type: 'rounded-box',
			},
			streak: {
				name: 'Стрик',
				sortable: true,
				type: 'rounded-box',
			},
			rerolled_own_game_count: {
				name: 'Рерольнуто своих игр',
				sortable: true,
				type: 'rounded-box',
			},
			created_by: {
				name: 'Создан',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			not_active_reason: {
				name: 'Причина не активности',
				sortable: true,
			},
			sort: {
				name: 'Сортировка',
				type: 'rounded-box',
				sortable: true,
			},
			premium: {
				name: 'Премиум',
				type: 'boolean',
				sortable: true,
			},
		}
);

const title = 'Игроки настольной игры';
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
			v-if="checkPermission('bg.players.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/BoardGamePlayer"
			entity="BoardGamePlayer"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/BoardGamePlayer/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
