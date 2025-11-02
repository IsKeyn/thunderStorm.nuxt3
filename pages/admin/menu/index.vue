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
			url: {
				name: 'Ссылка',
			},
			target: {
				name: 'Target',
			},
			menu_type_id: {
				name: 'ID типа меню',
			},
			link_type: {
				name: 'Тип ссылки',
			},
			icon: {
				name: 'Иконка',
			},
			sort: {
				name: 'Сортировка',
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
			:titles="titles"
			fetchUrl="admin/entity/Menu"
		/>
	</div>
</template>
