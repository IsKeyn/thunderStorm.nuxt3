<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import ListTable from '@/components/admin/list/ListTable.vue';

const titles = ref(
		{
			id: {
				name: 'id',
			},
			name: {
				name: 'Заголовок',
			},
			slug: {
				name: 'Slug',
			},
			text_preview: {
				name: 'Текст превью',
			},
			text_full: {
				name: 'Текст статьи',
			},
			image: {
				name: 'Изображение',
			},
			type: {
				name: 'Тип статьи',
			},
			entity_type: {
				name: 'Привязка к сущности (класс)',
			},
			entity_id: {
				name: 'Привязка к сущности (id)',
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
			name: 'Статьи',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
	<ListTable
		:titles="titles"
		titleKey="title"
		fetchUrl="admin/articles"
	/>
</template>
