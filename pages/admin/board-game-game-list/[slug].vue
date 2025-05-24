<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
			game_id: {
				name: 'ID игры',
				value: '',
				type: 'number',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			gaming_platform_id: {
				name: 'ID платформы',
				value: '',
				type: 'number',
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
				name: 'ID настолки',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			points: {
				name: 'Количество очков',
				value: '',
				type: 'number',
				validateRules: 'required, maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			active: {
				name: 'Активность',
				value: '1',
				type: 'checkbox',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			added_by: {
				name: 'Добавил',
				value: '',
				type: 'number',
				validateRules: 'maxLength_255',
				classes: ['w-full', 'mt-[5px]'],
			},
			created_by: {
				name: 'Создал',
				value: '',
				type: 'number',
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
