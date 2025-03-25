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
			slug: {
				name: 'Slug',
				value: '',
				type: 'text',
				validateRules: null,
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
			active: {
				name: 'Активность',
				value: '',
				type: 'text',
				classes: ['w-full', 'mt-[5px]'],
			},
			page: {
				name: 'ID страницы',
				value: '',
				type: 'text',
				classes: ['w-full', 'mt-[5px]'],
			},
			theme: {
				name: 'Тема',
				type: 'select',
				options: [
					{
						name: 'Waterfall',
						value: 0,
					},
					{
						name: 'Simple',
						value: 1,
					},
				],
				value: '0',
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
			name: 'Группы медиа',
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
		name: 'MultiImages',
		keyForBackend: 'media_group',
		params: {
			title: 'Изображения группы',
		},
	},
];
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<CreateEditForm
				:form="form"
				fetchUrl="admin/media-group"
				:extensions="extensions"
				:hasResource="true"
		/>
	</div>
</template>
