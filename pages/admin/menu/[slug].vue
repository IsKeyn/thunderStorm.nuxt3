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
				name: 'Наименование',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_40',
				classes: ['w-full', 'mt-[5px]'],
			},
			url: {
				name: 'Ссылка',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_200',
				classes: ['w-full', 'mt-[5px]'],
			},
			target: {
				name: 'target',
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
						name: '_blank',
						value: '_blank',
					},
				],
			},
			menu_type_id: {
				name: 'Тип меню',
				value: '',
				type: 'EntityList',
				apiUrl: 'entity/getFields',
				body: {
					entity: 'App\\Models\\MenuType',
				},
				hasResource: false,
				validateRules: 'required, maxLength_40',
				classes: ['w-full', 'mt-[5px]'],
			},
			link_type: {
				name: 'Тип ссылки',
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
						name: 'route',
						value: 'route',
					},
				],
			},
			icon: {
				name: 'Иконка',
				value: '',
				type: 'text',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			sort: {
				name: 'Сортировка',
				value: '',
				type: 'number',
				validateRules: '',
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
		}
);

const pageType = ref('');

const title = 'Элементы меню';
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

const extensions = [
	{
		name: 'Permissions',
		keyForBackend: 'permissions',
		params: {
			additionalDataKeys: ['permissions'],
		},
	},
];
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<CreateEditFormV2
			v-if="checkPermission('menu.edit')"
			:form="form"
			fetchUrl="admin/menu"
			:showTags="true"
			:hasResource="true"
			:useAdditionalData="true"
			:showAdditionalFieldsTab="true"
			:useVersionList="true"

			:extensions="extensions"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
