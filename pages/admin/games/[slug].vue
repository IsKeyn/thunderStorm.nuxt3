<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import CreateEditFormV2 from '@/components/admin/forms/CreateEditFormV2.vue';

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
				validateRules: 'required, minLength_2, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			title_image: {
				name: 'Титульное изображение',
				value: null,
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
				value: null,
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
			mod: {
				name: 'Модификация\\сборка\\хак',
				value: false,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			sort: {
				name: 'Сортировка',
				value: null,
				type: 'number',
				validateRules: 'integer',
				classes: ['w-full', 'mt-[5px]'],
			},
			spc_id: {
				name: 'speedrun.com api',
				value: null,
				type: 'text',
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
			show_in_list: {
				name: 'Отображать в списках',
				value: true,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
		}
);

const pageType = ref('');
const route = useRoute();

const title = 'Игры';
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
		name: 'Series',
		keyForBackend: 'series',
		params: {
			additionalDataKeys: ['series'],
		},
	},
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
</script>

<template>
	<div>
		<PageHeader
				:title="title"
				:breadCrumbs="breadCrumbsArray"
		/>
		<CreateEditFormV2
				:form="form"
				fetchUrl="admin/game"
				:additionalFieldsEnable="true"
				:showTags="true"
				:showSeo="true"
				:showMenu="true"
				:hasResource="true"
				:useAdditionalData="true"
				:useBlockEditor="true"
				:showAdditionalData="true"
				:extensions="extensions"
				previewUrl="/game/{slug}"
		/>
	</div>
</template>
