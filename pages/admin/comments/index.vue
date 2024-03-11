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
			author_name: {
				name: 'Имя автора',
			},
			email: {
				name: 'e-mail',
			},
			message: {
				name: 'Сообщение',
			},
			ip: {
				name: 'ip',
			},
			user_agent: {
				name: 'user_agent',
			},
			created_by: {
				name: 'ID автора',
			},
			entity_type: {
				name: 'Сущность',
			},
			entity_id: {
				name: 'ID элемента',
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
			name: 'Типы меню',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
	<ListTable
		:titles="titles"
		titleKey="message"
		fetchUrl="admin/entity/Comments"
	/>
</template>
