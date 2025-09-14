<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

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
				name: 'ID типа меню',
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
			name: 'Элементы меню',
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
				:form="form"
				fetchUrl="admin/entity/Menu"
		/>
	</div>
</template>
