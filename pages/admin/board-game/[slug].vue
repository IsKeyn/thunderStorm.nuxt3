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
				name: 'ID',
				value: '',
				type: 'notEditable',
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
			description: {
				name: 'Описание',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			media: {
				name: 'Медиа',
				value: '',
				keyValueFromObject: 'id',
				objectValue: null,
				type: 'fileFromGallery',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			active: {
				name: 'Активность',
				value: true,
				type: 'checkbox',
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
			is_close: {
				name: 'Закрыто',
				value: false,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			is_test: {
				name: 'Тестовая игра',
				value: false,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			started_at: {
				name: 'Дата начала',
				value: '',
				type: 'datetime-local',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			ended_at: {
				name: 'Дата конца',
				value: '',
				type: 'datetime-local',
				validateRules: null,
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
			created_at: {
				name: 'Дата создания',
				value: '',
				type: 'notEditable',
				classes: ['w-full', 'mt-[5px]'],
			},
			updated_at: {
				name: 'Дата обновления',
				value: '',
				type: 'notEditable',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const pageType = ref('');

const title = 'Настольная игра';
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
			v-if="checkPermission('bg.edit')"
			:form="form"
			fetchUrl="admin/BoardGame/BoardGame"
			:additionalFieldsEnable="true"
			:showTags="true"
			:showSeo="true"
			:showMenu="true"
			:hasResource="true"
			:useBlockEditor="true"
			:showAdditionalFieldsTab="true"
			:useVersionList="true"
			previewUrl="/e/{slug}"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
