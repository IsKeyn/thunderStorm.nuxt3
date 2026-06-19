<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import ListTableV2 from '@/components/admin/list/ListTableV2.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { roles } from '@/composables/roles.js';
const { checkPermission } = roles();

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
			},
			media: {
				name: 'Изображение',
				type: 'media'
			},
			started_at: {
				name: 'Дата начала',
				type: 'date',
				sortable: true,
			},
			ended_at: {
				name: 'Дата конца',
				type: 'date',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			sort: {
				name: 'Сортировка',
				type: 'rounded-box',
				sortable: true,
			},
			is_close: {
				name: 'Закрыто',
				type: 'boolean',
				sortable: true,
			},
			is_test: {
				name: 'Тестовая игра',
				type: 'boolean',
				sortable: true,
			},
			created_by: {
				name: 'Кем создан',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
		}
);

const pageType = ref('');

const title = 'Настольная игра';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: 'Админ панель',
			href: `/${splitedPath[1]}`,
		},
		{
			name: title,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});

const defaultFilters = {
	sort: {
		field: "id",
		sort: "desc",
	},
}

const sortOptions = [
	{
		name: 'id',
		value: 'id',
	},
	{
		name: 'Сортировка',
		value: 'sort',
	},
	{
		name: 'Название',
		value: 'name',
	},
];

const usedFilters = [
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
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<ListTableV2
			v-if="checkPermission('bg.edit')"
			:titles="titles"
			fetchUrl="admin/BoardGame/BoardGame"
			entity="BoardGame"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/BoardGame/BoardGame/filters"
			previewUrl="/e/{slug}"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
