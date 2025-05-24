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
			game_id: {
				name: 'ID игры',
			},
			gaming_platform_id: {
				name: 'ID платформы',
			},
			description: {
				name: 'Описание',
			},
			board_game_id: {
				name: 'ID настолки',
			},
			points: {
				name: 'Количество очков за игру',
			},
			active: {
				name: 'Активность',
			},
			added_by: {
				name: 'Добавил',
			},
			created_by: {
				name: 'Создал',
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
			name: 'Список игр в настолке',
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
		fetchUrl="admin/entity/BoardGame/BoardGameGameList"
	/>
</template>
