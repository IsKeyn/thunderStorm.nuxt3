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
			user_id: {
				name: 'UserId',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			message: {
				name: 'Сообщение',
				sortable: true,
			},
			viewed: {
				name: 'Просмотрено',
				type: 'boolean',
				sortable: true,
			},
			entity_type: {
				name: 'entity_type',
				sortable: true,
			},
			entity_id: {
				name: 'entity_id',
				type: 'rounded-box',
				sortable: true,
			},
			sort: {
				name: 'Сортировка',
				sortable: true,
			},
			created_by: {
				name: 'Создан',
				type: 'EntityList',
				apiUrl: 'user/list',
				sortable: true,
			},
			created_at: {
				name: 'Дата создания',
				sortable: true,
			},
		}
);

const title = 'Оповещения';
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
	{
		name: 'Лайки',
		value: 'likes',
	},
	{
		name: 'Просмотры',
		value: 'views',
	},
	{
		name: 'Дата релиза',
		value: 'date',
	},
	{
		name: 'Дата публикации',
		value: 'created_at',
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
			v-if="checkPermission('user.notification.edit')"
			:titles="titles"
			fetchUrl="admin/notification"
			entity="notification"
			:hasResource="true"
			:usePagination="true"
			:usedFilters="usedFilters"
			:defaultFilters="defaultFilters"
			:sortOptions="sortOptions"
			filterRequestUrl="admin/notification/filters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
