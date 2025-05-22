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
				name: 'ID пользователя',
			},
			board_game_game_list_id: {
				name: 'ID игры в списке доступных на эвенте игр',
			},
			status: {
				name: 'Текущий статус',
			},
			board_game_id: {
				name: 'ID настольной игры',
			},
			comment_id: {
				name: 'ID комментария',
			},
			time: {
				name: 'Время затраченное на игру',
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
		fetchUrl="admin/entity/BoardGame/PlayerGame"
	/>
</template>
