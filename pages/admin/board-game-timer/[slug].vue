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
			name: {
				name: 'Название',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			slug: {
				name: 'Slug',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
				autoFill: {
					sourceFieldKey: 'name',
					rule: 'slug',
				},
			},
			description: {
				name: 'Описание',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[200px]'],
			},
			limit: {
				name: 'Лимит (в секундах)',
				value: null,
				type: 'number',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			settings: {
				name: 'Настройки',
				value: '',
				type: 'json',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			active: {
				name: 'Активность',
				value: true,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			user_id: {
				name: 'Пользователь',
				value: null,
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			board_game_id: {
				name: 'ID настолькой игры',
				value: null,
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'Создан кем',
				value: null,
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const pageType = ref('');

const title = 'Таймеры';
const breadCrumbsArray = computed(() => {
	const dividedPath = route.path.split('/');

	if (Number.isInteger(Number(route.params.slug))) {
		pageType.value = 'update';
	} else if (route.params.slug === 'create') {
		pageType.value = 'create';
	}

	return [
		{
			name: 'Админ панель',
			href: `/${dividedPath[1]}`,
		},
		{
			name: title,
			href: `/${dividedPath[1]}/${dividedPath[2]}`,
		},
		{
			name: pageType.value === 'create' ? 'Создание' : 'Редактирование',
			href: `/${dividedPath[1]}/${dividedPath[2]}/${dividedPath[3]}`,
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
			v-if="checkPermission('bg.timer.edit')"
			:form="form"
			fetchUrl="admin/BoardGame/timer"
			:hasResource="true"
			:useVersionList="true"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
