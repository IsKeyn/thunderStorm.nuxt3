<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import CreateEditFormV2 from '@/components/admin/forms/CreateEditFormV2.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

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
			sort: {
				name: 'Сортировка',
				value: null,
				type: 'number',
				validateRules: 'integer',
				classes: ['w-full', 'mt-[5px]'],
			},
			type: {
				name: 'type',
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
						name: 'Игровая серия',
						value: 1,
					},
					{
						name: 'Серия фильмов',
						value: 2,
					},
				],
			},
			active: {
				name: 'Активность',
				value: true,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			spc_id: {
				name: 'speedrun.com api',
				value: null,
				type: 'text',
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
				value: null,
				type: 'notEditable',
				classes: ['w-full', 'mt-[5px]'],
			},
			updated_at: {
				name: 'Дата обновления',
				value: null,
				type: 'notEditable',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const pageType = ref('');

const title = 'Серии';
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
		name: 'Games',
		keyForBackend: 'game',
		params: {
			additionalDataKeys: ['game'],
		},
	},
];
</script>

<template>
	<div>
		<PageHeader
				:title="title"
				:breadCrumbs="breadCrumbsArray"
		/>
		<CreateEditFormV2
				:form="form"
				fetchUrl="admin/series"
				:additionalFieldsEnable="true"
				:showTags="true"
				:showSeo="true"
				:hasResource="true"
				:showAdditionalFieldsTab="true"
				previewUrl="/series/{slug}"
				:useVersionList="true"

				:useAdditionalData="true"
				:extensions="extensions"
		/>
	</div>
</template>
