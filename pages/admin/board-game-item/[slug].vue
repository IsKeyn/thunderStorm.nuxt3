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
			name: {
				name: 'Название',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_3, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			slug: {
				name: 'Slug',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_3, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
				autoFill: {
					sourceFieldKey: 'name',
					rule: 'slug',
				},
			},
			short_description: {
				name: 'Короткое описание',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			full_description: {
				name: 'Полное описание',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			actions: {
				name: 'Действия JSON',
				value: '',
				type: 'json',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			type: {
				name: 'Тип',
				value: 0,
				type: 'select',
				options: [
					{
						name: 'Положительный',
						value: 0,
					},
					{
						name: 'Отрицательный',
						value: 1,
					},
				],
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			image: {
				name: 'Медиа',
				value: '',
				keyValueFromObject: 'id',
				objectValue: null,
				type: 'fileFromGallery',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			sound: {
				name: 'Звук',
				value: '',
				keyValueFromObject: 'id',
				objectValue: null,
				type: 'fileFromGallery',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			sort: {
				name: 'Сортировка',
				value: '',
				type: 'text',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			active: {
				name: 'Активность',
				value: 1,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			drop_chance: {
				name: 'Шанс дропа',
				value: 10,
				type: 'number',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			price: {
				name: 'Цена',
				value: null,
				type: 'number',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			author: {
				name: 'Автор',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'Создан кем',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const pageType = ref('');

const title = 'Предметы в настолке';
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
			v-if="checkPermission('bg.item.edit')"
			:form="form"
			fetchUrl="admin/BoardGame/item"
			:additionalFieldsEnable="true"
			:showTags="true"
			:showSeo="true"
			:showMenu="true"
			:hasResource="true"
			:useBlockEditor="true"
			:showAdditionalFieldsTab="true"
			:useVersionList="true"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
