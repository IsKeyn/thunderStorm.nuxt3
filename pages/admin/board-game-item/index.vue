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
				name: 'Название',
			},
			slug: {
				name: 'Slug',
			},
			short_description: {
				name: 'Короткое описание',
				type: 'cutText',
			},
			full_description: {
				name: 'Полное описание',
				type: 'cutText',
			},
			actions: {
				name: 'Действия (json)',
				type: 'cutText',
			},
			type: {
				name: 'Тип',
			},
			drop_chance: {
				name: 'Шанс дропа',
			},
			active: {
				name: 'Активность',
				type: 'boolean',
			},
			author: {
				name: 'Автор',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
			created_by: {
				name: 'Создан кем',
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
			name: 'Предметы в настолке',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
	<ListTable
			v-if="checkPermission('bg.item.edit')"
		:titles="titles"
		titleKey="title"
		fetchUrl="admin/BoardGame/Item"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
