<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

import { roles } from '@/composables/roles.js';
const { checkPermission } = roles();

const form = ref(
		{
			site_id: {
				name: 'id сайта',
				value: '',
				type: 'text',
				validateRules: 'required',
				classes: ['w-full', 'mt-[5px]'],
			},
			name: {
				name: 'Наименование',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			code: {
				name: 'Символьное наименование',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			value: {
				name: 'Значение',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
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
		}
);

const pageType = ref('');
const route = useRoute();

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
			name: 'Настройки',
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
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<CreateEditForm
				v-if="checkPermission('site.edit')"
				:form="form"
				fetchUrl="admin/entity/Setting"
		/>
		<ui-itemBox
				v-else
				classes="red"
				message="У вас нет доступа"
		/>
	</div>
</template>
