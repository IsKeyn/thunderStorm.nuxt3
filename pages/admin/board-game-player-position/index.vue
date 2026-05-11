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
			user_id: {
				name: 'ID пользователя',
			},
			position: {
				name: 'Позиция',
			},
			board_game_id: {
				name: 'ID настольной игры',
			},
			has_use_effect: {
				name: 'Был ли использован эффект ячейки',
			},
			created_by: {
				name: 'created_by',
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
			name: 'Позиции игроков',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
	<ListTable
			v-if="checkPermission('bg.player-position.edit')"
		:titles="titles"
		titleKey="title"
		fetchUrl="admin/entity/BoardGame/BoardGamePlayerPosition"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="У вас нет доступа"
	/>
</template>
