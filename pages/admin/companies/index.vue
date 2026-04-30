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
			spc_id: {
				name: 'spc ID',
				sortable: true,
			},
			created_by: {
				name: 'Кем создан',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
		}
);

const title = 'Компании';
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
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="breadCrumbsArray"
	/>
	<ListTableV2
			:titles="titles"
			fetchUrl="admin/company"
			entity="company"
			:hasResource="true"
			:usePagination="true"
			previewUrl="/company/{slug}"
			:defaultFilters="defaultFilters"
	/>
</template>
