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
			name: {
				name: 'Наименование',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			code: {
				name: 'Код',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
				autoFill: {
					sourceFieldKey: 'name',
					rule: 'slug',
				},
			},
			group_icon: {
				name: 'Иконка fa',
				value: '',
				type: 'text',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			group: {
				name: 'Это группа',
				value: false,
				type: 'checkbox',
				validateRules: '',
				showTitle: false,
				classes: ['w-full', 'mt-[5px]'],
			},
			menu_type_bind_type: {
				name: 'Привязка сущности',
				value: '',
				type: 'EntityBind',
				bindField: 'menu_type_bind_id',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			menu_type_bind_id: {
				name: 'ID привязанной сущности',
				value: '',
				type: 'disable',
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
				value: true,
				type: 'checkbox',
				validateRules: '',
				showTitle: false,
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
			name: 'Типы меню',
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
				v-if="checkPermission('menu.edit')"
				:form="form"
				fetchUrl="admin/entity/MenuType"
		/>
		<ui-itemBox
				v-else
				classes="red"
				message="У вас нет доступа"
		/>
	</div>
</template>
