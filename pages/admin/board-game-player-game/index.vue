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
				name: 'ID пользователя',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			bg_player_id: {
				name: 'ID игрока',
				type: 'text',
				sortable: true,
			},
			board_game_game_list_id: {
				name: 'ID игры в списке доступных на эвенте игр',
				sortable: true,
				type: 'rounded-box',
			},
			status: {
				name: 'Текущий статус',
				sortable: true,
				type: 'rounded-box',
			},
			board_game_id: {
				name: 'Ивент',
				type: 'EntityList',
				apiUrl: 'board-game/getShortList?fullList=true',
				sortable: true,
			},
			type: {
				name: 'Тип',
				sortable: true,
				type: 'rounded-box',
			},
			from_user_id: {
				name: 'От кого',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			comment_id: {
				name: 'ID комментария',
				type: 'rounded-box',
				sortable: true,
			},
			time: {
				name: 'Время затраченное на игру',
				type: 'rounded-box',
				sortable: true,
			},
			points: {
				name: 'Получил очков за игру',
				type: 'rounded-box',
				sortable: true,
			},
			created_by: {
				name: 'Создал',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			finished_at: {
				name: 'Дата завершения',
				sortable: true,
				type: 'date',
			},
		}
);

const pageType = ref('');

const title = 'Игры игроков настольной игры';
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
			v-if="checkPermission('bg.player-game.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/PlayerGame"
			entity="BoardGame"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/PlayerGame/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
