<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
			id: {
				name: 'id',
				value: '',
				type: 'hidden',
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
			title_image: {
				name: 'Титульное изображение',
				value: '',
				keyValueFromObject: 'id',
				objectValue: null,
				type: 'fileFromGallery',
				validateRules: '',
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
			created_at: {
				name: 'Дата создания',
				value: '',
				type: 'datetime-local',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]'],
			},
			description: {
				name: 'Описание',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
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
			name: 'Игры',
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
		name: 'Groups',
		keyForBackend: 'groups',
		params: {
			additionalDataKeys: ['group'],
		},
	},
	{
		name: 'Genres',
		keyForBackend: 'genres',
		params: {
			additionalDataKeys: ['genre'],
		},
	},
	{
		name: 'MultiImages',
		keyForBackend: 'covers',
		params: null,
	},
	{
		name: 'AnonsDates',
		keyForBackend: 'anons_dates',
		params: null,
	},
	{
		name: 'ReleaseDates',
		keyForBackend: 'release_dates',
		params: {
			additionalDataKeys: ['gaming_platform'],
		},
	},
	{
		name: 'Companies',
		keyForBackend: 'companies',
		params: {
			additionalDataKeys: ['company', 'company_role'],
		},
	},
	{
		name: 'Links',
		keyForBackend: 'links',
		params: null,
	},
];

const defaultValuesForAdditionalFields = [
	{
		name: 'Название',
		slug: 'name',
		value: '',
		sort: '10',
	},
	{
		name: 'Количество дисков',
		slug: 'disc_count',
		value: '',
		sort: '20',
	},
];
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<CreateEditForm
				:form="form"
				fetchUrl="admin/game"
				:additionalFieldsEnable="true"
				:defaultValuesForAdditionalFields="defaultValuesForAdditionalFields"
				:showTags="true"
				:showSeo="true"
				:showMenu="true"
				:hasResource="true"
				:useAdditionalData="true"
				:useBlockEditor="true"
				:extensions="extensions"
		/>
	</div>
</template>
