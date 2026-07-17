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
			sort: {
				name: 'Сортировка',
				sortable: true,
			},
			active: {
				name: 'Активность',
				type: 'boolean',
				sortable: true,
			},
			created_by: {
				name: 'Кем создан',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
		}
);

const pageType = ref('');

const title = 'Персонажи';
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
			v-if="checkPermission('character.edit')"
			:titles="titles"
			fetchUrl="admin/character"
			entity="character"
			:hasResource="true"
			:usePagination="true"
			previewUrl="/character/{slug}"
			:defaultFilters="defaultFilters"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
