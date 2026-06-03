<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import ListTable from '@/components/admin/list/ListTable.vue';

import { roles } from '@/composables/roles.js';
const { checkPermission } = roles();

const titles = ref(
		{
			id: {
				name: 'id',
			},
			name: {
				name: 'Имя',
			},
			media_id: {
				name: 'Медиа',
			},
			url: {
				name: 'url',
			},
			description: {
				name: 'Описание',
				type: 'cutText',
			},
			sort: {
				name: 'Сортировка',
			},
			active: {
				name: 'Активность',
				type: 'boolean',
			},
			created_by: {
				name: 'Кем создан',
				type: 'EntityList',
				apiUrl: 'user/list',
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
			name: 'Рекомендации',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
	<ListTable
			v-if="checkPermission('recommend.edit')"
		:titles="titles"
		titleKey="title"
		:hasResource="true"
		fetchUrl="admin/recommendation"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
