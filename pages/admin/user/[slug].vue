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
				validateRules: 'required, minLength_3, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			public_name: {
				name: 'Отображаемое имя',
				value: '',
				type: 'text',
				validateRules: 'minLength_3, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
				autoFill: {
					sourceFieldKey: 'name',
				},
			},
			email: {
				name: 'email',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_3, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			email_verified_at: {
				name: 'Дата подтверждения email',
				value: '',
				type: 'datetime-local',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			avatar: {
				name: 'Аватар',
				value: null,
				keyValueFromObject: 'id',
				objectValue: null,
				type: 'fileFromGallery',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			password: {
				name: 'Пароль',
				value: '',
				type: 'text',
				validateRules: 'minLength_3, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			settings: {
				name: 'Настройки',
				value: '',
				type: 'json',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			is_admin: {
				name: 'Администратор',
				value: false,
				type: 'checkbox',
				validateRules: '',
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
		}
);

const pageType = ref('');

const title = 'Пользователи';
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
		name: 'Autologin',
	},
	{
		name: 'Logout',
	},
	{
		name: 'Roles',
		keyForBackend: 'roles',
		params: {
			additionalDataKeys: ['roles'],
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
			v-if="checkPermission('user.edit')"
			:form="form"
			fetchUrl="admin/user"
			:additionalFieldsEnable="true"
			:showTags="true"
			:hasResource="true"
			:useAdditionalData="true"
			:showAdditionalFieldsTab="true"
			previewUrl="/profile/{slug}"
			:useVersionList="true"

			:extensions="extensions"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
