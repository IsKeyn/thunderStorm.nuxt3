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
				name: 'Название',
			},
			slug: {
				name: 'Slug',
			},
			description: {
				name: 'Описание',
			},
			started_at: {
				name: 'Дата начала',
			},
			ended_at: {
				name: 'Дата конца',
			},
			active: {
				name: 'Активность',
			},
			created_by: {
				name: 'Кем создан',
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
			name: 'Настольная игра',
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
		fetchUrl="admin/entity/BoardGame/BoardGame"
	/>
</template>
