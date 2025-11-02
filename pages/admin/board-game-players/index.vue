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
			user_id: {
				name: 'User ID',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
			board_game_id: {
				name: 'ID настольной игры',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
			},
			points: {
				name: 'Количество очков',
			},
			item_roll_count: {
				name: 'Доступное количество ролов игры',
			},
			step_count: {
				name: 'Доступное количество ходов',
			},
			streak: {
				name: 'Стрик',
			},
			rerolled_own_game_count: {
				name: 'Рерольнуто своих игр',
			},
			created_by: {
				name: 'Создан',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
			active: {
				name: 'Активность',
				type: 'boolean',
			},
			not_active_reason: {
				name: 'Причина не активности',
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
			name: 'Игроки настольной игры',
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
		fetchUrl="admin/entity/BoardGame/BoardGamePlayer"
	/>
</template>
