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
			user_id: {
				name: 'Игрок',
				type: 'EntityList',
				apiUrl: 'user/list',
			},
			board_game_id: {
				name: 'Настольная игра',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				classes: '!bg-[#004251eb]',
			},
			status_effect_id: {
				name: 'Статус эффект',
				type: 'EntityList',
				apiUrl: 'entity/getFields',
				body: {
					entity: 'App\\Models\\BoardGame\\StatusEffect',
				},
				hasResource: false,
				classes: '!bg-[#004251eb]',
			},
			active: {
				name: 'Активность',
				type: 'boolean',
			},
			created_by: {
				name: 'Создан',
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
			name: 'Эффекты статуса игрока',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
	<ListTable
			v-if="checkPermission('bg.status-effect-on-player.edit')"
		:titles="titles"
		titleKey="title"
		fetchUrl="admin/entity/BoardGame/PlayerStatusEffect"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
