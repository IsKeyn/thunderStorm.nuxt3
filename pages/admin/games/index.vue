<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import ListTableV2 from '@/components/admin/list/ListTableV2.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

const titles = ref(
		{
			id: {
				name: 'id',
				sortable: true,
				type: 'rounded-box',
			},
			name: {
				name: 'Название',
				sortable: true,
			},
			slug: {
				name: 'Slug',
				sortable: true,
			},
			description: {
				name: 'Описание',
				type: 'cutText',
				sortable: true,
			},
			title_image: {
				name: 'Титульное изображение',
				type: 'media',
			},
			sort: {
				name: 'Сортировка',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			show_in_list: {
				name: 'Отображать в списках',
				type: 'boolean',
				sortable: true,
			},
		}
);

const title = 'Игры';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: 'Админ панель',
			href: `/${splitedPath[1]}`,
		},
		{
			name: 'Игры',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});

const usedFilters = [
	{
		name: 'gamePlatforms',
		langName: 'Игровые платформы',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'genres',
		langName: 'Жанры',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'companies',
		langName: 'Компании',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'series',
		langName: 'Серия',
		type: 'multiselect',
		requestData: true,
		parse: true,
	},
	{
		name: 'events',
		langName: 'Ивенты',
		type: 'multiselect',
		requestData: true,
		parse: true,
	},
	{
		name: 'onlyTrashed',
		langName: 'Только удаленные',
		type: 'checkbox',
	},
	{
		name: 'tags',
		langName: 'Теги',
		type: 'curtained',
		requestData: true,
	},
];

const defaultFilters = {
	sort: {
		field: "id",
		sort: "desc",
	},
}
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<ListTableV2
		:titles="titles"
		fetchUrl="admin/game"
		:hasResource="true"
		:usePagination="true"
		:additionalButtons="[
				{
					name: 'Загрузить по API',
					url: '/admin/games/get-from-api/',
				},
		]"
		:usedFilters="usedFilters"
		:defaultFilters="defaultFilters"
		previewUrl="/game/{slug}"
	/>
</template>
