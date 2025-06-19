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
				name: 'Наименование',
			},
			short_name: {
				name: 'Короткое название',
			},
			slug: {
				name: 'Slug',
			},
			description: {
				name: 'Описание',
			},
			release_time: {
				name: 'Дата и время выхода',
			},
			sort: {
				name: 'Сортировка',
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
			name: 'Игровые платформы',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<ListTable
			:titles="titles"
			fetchUrl="admin/entity/GamingPlatform"
		/>
	</div>
</template>
