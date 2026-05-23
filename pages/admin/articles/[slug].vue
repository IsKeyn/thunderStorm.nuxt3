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
				name: 'Заголовок',
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
			text_preview: {
				name: 'Текст превью',
				value: '',
				type: 'textarea',
				resize: true,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			text_full: {
				name: 'Текст статьи',
				value: '',
				type: 'textarea',
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			title_image: {
				name: 'Изображение',
				value: '',
				keyValueFromObject: 'id',
				objectValue: null,
				type: 'fileFromGallery',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				formHandlerType: 0,
			},
			type: {
				name: 'Тип статьи',
				value: 0,
				type: 'select',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				options: [
					{
						name: 'Статья',
						value: 0,
					},
					{
						name: 'Новости',
						value: 1,
					},
					{
						name: 'Программа',
						value: 2,
					},
				],
			},
			entity_type: {
				name: 'Привязка к сущности',
				type: 'EntityBind',
				bindField: 'entity_id',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			entity_id: {
				name: 'Привязка к сущности',
				type: 'disable',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'ID автора',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			editor: {
				name: 'ID редактор',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			show_author: {
				name: 'Показывать автора',
				value: 0,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			show_editor: {
				name: 'Показывать редактора',
				value: 0,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			active: {
				name: 'Активность',
				value: 1,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			published_at: {
				name: 'Дата публикации',
				value: '',
				type: 'datetime-local',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_at: {
				name: 'Дата создания',
				value: '',
				type: 'datetime-local',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const pageType = ref('');

const title = 'Статьи';
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
			v-if="checkPermission('article.edit')"
			:form="form"
			fetchUrl="admin/article"
			:additionalFieldsEnable="true"
			:showTags="true"
			:showSeo="true"
			:showMenu="true"
			:hasResource="true"
			:useBlockEditor="true"
			:showAdditionalFieldsTab="true"
			:useVersionList="true"
			previewUrl="/article/{slug}"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
