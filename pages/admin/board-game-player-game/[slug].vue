<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
			user_id: {
				name: 'ID пользователя',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			board_game_game_list_id: {
				name: 'ID игры в списке доступных на эвенте игр',
				value: '',
				type: 'EntityList',
				apiUrl: 'admin/entity/BoardGame/BoardGameGameList',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			status: {
				name: 'Текущий статус',
				value: null,
				type: 'select',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				options: [
					{
						name: 'Не выбрано',
						value: null,
					},
					{
						name: 'Текущая',
						value: 0,
					},
					{
						name: 'Рерольнута',
						value: 1,
					},
					{
						name: 'Пройдена',
						value: 2,
					},
					{
						name: 'Отдана',
						value: 3,
					},
					{
						name: 'В очереди',
						value: 4,
					},
				],
			},
			board_game_id: {
				name: 'Ивент',
				value: '',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			type: {
				name: 'Тип',
				value: null,
				type: 'select',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				options: [
					{
						name: 'Не выбрано',
						value: null,
					},
					{
						name: 'Отданная',
						value: 0,
					},
					{
						name: 'Мошна',
						value: 1,
					},
				],
			},
			from_user_id: {
				name: 'От кого',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			comment_id: {
				name: 'ID комментария',
				value: '',
				type: 'number',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			time: {
				name: 'Время затраченное на игру',
				value: '',
				type: 'text',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'Кем создан',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
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
				fetchUrl="admin/entity/BoardGame/PlayerGame"
		/>
	</div>
</template>
