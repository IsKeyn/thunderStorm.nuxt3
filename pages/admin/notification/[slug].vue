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
			user_id: {
				name: 'UserId',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			message: {
				name: 'Сообщение',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			actions: {
				name: 'Действия',
				value: '',
				type: 'json',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			viewed: {
				name: 'Просмотрено',
				value: false,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			entity_type: {
				name: 'Привязка сущности',
				value: '',
				type: 'EntityBind',
				bindField: 'entity_id',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			entity_id: {
				name: 'ID привязанной сущности',
				value: '',
				type: 'disable',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			sort: {
				name: 'Сортировка',
				value: null,
				type: 'number',
				validateRules: 'integer',
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
		}
);

const pageType = ref('');

const title = 'Оповещения';
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
			v-if="checkPermission('user.notification.edit')"
			:form="form"
			fetchUrl="admin/notification"
			:additionalFieldsEnable="true"
			:showTags="true"
			:hasResource="true"
			:showAdditionalFieldsTab="true"
			:useVersionList="true"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
