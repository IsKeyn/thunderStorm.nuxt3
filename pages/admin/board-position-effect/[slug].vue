<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
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
			actions: {
				name: 'Действие',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			title_image: {
				name: 'Медиа',
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
				type: 'number',
				validateRules: null,
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
			created_by: {
				name: 'Кем создан',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
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
			name: 'Эффекты на позиции',
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
				:showAdditionalFieldsTab="false"
				fetchUrl="admin/entity/BoardGame/BoardPositionEffect"
				:hasResource="true"
		/>
	</div>
</template>
