<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import CreateEditFormV2 from '@/components/admin/forms/CreateEditFormV2.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { roles } from '@/composables/roles.js';
const { checkPermission } = roles();

const form = ref(
		{
			id: {
				name: 'id',
				value: null,
				type: 'notEditable',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			user_id: {
				name: 'ID пользователя',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			bg_player_id: {
				name: 'ID игрока',
				type: 'text',
				validateRules: 'required',
				classes: ['w-full', 'mt-[5px]'],
			},
			board_game_game_list_id: {
				name: 'ID игры в списке доступных на эвенте игр',
				value: '',
				type: 'EntityList',
				apiUrl: 'admin/entity/BoardGame/BoardGameGameList',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			status: {
				name: 'Текущий статус',
				value: null,
				type: 'select',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				options: [
					{
						name: 'Не выбрано',
						value: null,
					},
					{
						name: 'Текущая',
						value: 0,
					},
					{
						name: 'Рерольнута',
						value: 1,
					},
					{
						name: 'Пройдена',
						value: 2,
					},
					{
						name: 'Отдана',
						value: 3,
					},
					{
						name: 'В очереди',
						value: 4,
					},
				],
			},
			board_game_id: {
				name: 'Ивент',
				value: '',
				type: 'EntityList',
				apiUrl: 'board-game/getShortList?fullList=true',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			type: {
				name: 'Тип',
				value: null,
				type: 'select',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				options: [
					{
						name: 'Не выбрано',
						value: null,
					},
					{
						name: 'Отданная',
						value: 0,
					},
					{
						name: 'Мошна',
						value: 1,
					},
				],
			},
			from_user_id: {
				name: 'От кого',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			comment_id: {
				name: 'ID комментария',
				value: '',
				type: 'number',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			time: {
				name: 'Время затраченное на игру',
				value: '',
				type: 'text',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			points: {
				name: 'Получил очков за игру',
				value: '',
				type: 'text',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'Кем создан',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			active: {
				name: 'Активность',
				value: true,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			finished_at: {
				name: 'Дата завершения',
				value: '',
				type: 'datetime-local',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const pageType = ref('');

const title = 'Игры игроков настольной игры';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	if (Number.isInteger(Number(route.params.slug))) {
		pageType.value = 'update';
	} else if (route.params.slug === 'create') {
		pageType.value = 'create';
	}

	return [
		{
			name: 'Админ панель',
			href: `/${splitedPath[1]}`,
		},
		{
			name: title,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: pageType.value === 'create' ? 'Создание' : 'Редактирование',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<CreateEditFormV2
			v-if="checkPermission('bg.player-game.edit')"
			:form="form"
			fetchUrl="admin/BoardGame/PlayerGame"
			:hasResource="true"
			:useVersionList="true"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
