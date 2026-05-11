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
				name: 'Наименование',
			},
			description: {
				name: 'Описание',
			},
			mime_type: {
				name: 'mime_type',
			},
			size: {
				name: 'Размер',
			},
			src: {
				name: 'Изображение',
				type: 'media'
			},
			type: {
				name: 'Тип',
			},
			created_by: {
				name: 'Создан',
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
			name: 'Элементы меню',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<ListTable
				v-if="checkPermission('media.edit')"
				:titles="titles"
				fetchUrl="admin/media"
				:hasResource="true"
				:hasMultiUpload="true"
				:usePagination="true"
				:perPage="10"
		/>
		<ui-itemBox
				v-else
				classes="red"
				message="У вас нет доступа"
		/>
	</div>
</template>
