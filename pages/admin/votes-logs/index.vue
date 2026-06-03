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
			vote_type: {
				name: 'Тип голоса',
			},
			vote_value: {
				name: 'Вес голоса',
			},
			entity_type: {
				name: 'entity type',
			},
			entity_id: {
				name: 'entity id',
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
			name: 'Лог голосов',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<ListTable
				v-if="checkPermission('votes-logs.edit')"
			:titles="titles"
			fetchUrl="admin/entity/VotesLog"
		/>
		<ui-itemBox
				v-else
				classes="red"
				message="У вас нет доступа"
		/>
	</div>
</template>
