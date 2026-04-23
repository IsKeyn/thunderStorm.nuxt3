<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
			user_id: {
				name: 'Игрок',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			board_game_id: {
				name: 'Настольная игра',
				value: '',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			board_game_item_id: {
				name: 'ID привязки предмета',
				value: '',
				type: 'EntityList',
				apiUrl: 'entity/getFields',
				body: {
					entity: 'App\\Models\\BoardGame\\ItemBind',
				},
				hasResource: false,
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			has_used: {
				name: 'Был использован',
				value: false,
				type: 'checkbox',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
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
			name: 'Инвентарь игроков в настолке',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: pageType.value === 'create' ? 'Создание' : 'Редактирование',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<CreateEditForm
				:form="form"
				:showAdditionalFieldsTab="false"
				fetchUrl="admin/entity/BoardGame/BoardGameInventory"
		/>
	</div>
</template>
