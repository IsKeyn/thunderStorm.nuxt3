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
				name: 'Игра',
				type: 'EntityList',
				apiUrl: 'game/list',
			},
			gaming_platform_id: {
				name: 'Платформа',
				type: 'EntityList',
				apiUrl: 'admin/entity/GamingPlatform',
			},
			description: {
				name: 'Описание',
				type: 'cutText',
			},
			board_game_id: {
				name: 'Ивент',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
			},
			points: {
				name: 'Количество очков за игру',
			},
			difficult: {
				name: 'Сложность в процентах',
			},
			game_completion_time: {
				name: 'Время на прохождение (в минутах)',
			},
			coop: {
				name: 'Кооп',
				type: 'boolean',
			},
			list_type: {
				name: 'Тип списка',
			},
			active: {
				name: 'Активность',
				type: 'boolean',
			},
			source: {
				name: 'Источник',
				type: 'cutText',
			},
			added_by: {
				name: 'Кто добавил',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
			created_by: {
				name: 'Кто создал',
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
