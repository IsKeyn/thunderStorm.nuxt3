<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
			game_id: {
				name: 'Игра',
				value: '',
				type: 'EntityList',
				apiUrl: 'game/list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			gaming_platform_id: {
				name: 'Платформа',
				value: '',
				type: 'EntityList',
				apiUrl: 'admin/entity/GamingPlatform',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			description: {
				name: 'Описание',
				value: '',
				type: 'textarea',
				validateRules: null,
				classes: ['w-full', 'mt-[5px]', 'resize-y', 'min-h-[400px]'],
			},
			board_game_id: {
				name: 'Ивент',
				value: '',
				type: 'EntityList',
				apiUrl: 'board-game/get-list',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			points: {
				name: 'Количество очков',
				value: '',
				type: 'number',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			difficult: {
				name: 'Сложность в процентах',
				value: '',
				type: 'number',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			game_completion_time: {
				name: 'Время на прохождение (в минутах)',
				value: '',
				type: 'number',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			coop: {
				name: 'Кооп',
				value: false,
				type: 'checkbox',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			list_type: {
				name: 'Тип списка',
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
						name: 'Золотой список',
						value: 1,
					},
				],
			},
			active: {
				name: 'Активность',
				value: true,
				type: 'checkbox',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
				showTitle: false,
			},
			source: {
				name: 'Источник',
				value: '',
				type: 'text',
				validateRules: 'maxLength_1024',
				classes: ['w-full', 'mt-[5px]'],
			},
			added_by: {
				name: 'Кто добавил',
				value: '',
				type: 'EntityList',
				apiUrl: 'user/list',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'Кто создал',
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
				:showAdditionalData="false"
				fetchUrl="admin/entity/BoardGame/BoardGameGameList"
		/>
	</div>
</template>
