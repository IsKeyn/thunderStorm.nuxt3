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
			slug: {
				name: 'Slug',
			},
			description: {
				name: 'Описание',
			},
			active: {
				name: 'Активность',
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
			name: 'Группы медиа',
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
			fetchUrl="admin/media-group"
		/>
	</div>
</template>
