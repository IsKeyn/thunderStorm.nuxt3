<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import CreateEditForm from '@/components/admin/forms/CreateEditForm.vue';

const form = ref(
		{
			vote_type: {
				name: 'Тип голоса',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_40', // TODO Валидация, Допустимые значения 1,2,3
				classes: ['w-full', 'mt-[5px]'],
			},
			vote_value: {
				name: 'Вес голоса',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_40', // TODOВ алидация, только цифры
				classes: ['w-full', 'mt-[5px]'],
			},
			entity_type: {
				name: 'entity type',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_40',
				classes: ['w-full', 'mt-[5px]'],
			},
			entity_id: {
				name: 'entity id',
				value: '',
				type: 'text',
				validateRules: 'required, maxLength_40', // TODO Валидация только цифры
				classes: ['w-full', 'mt-[5px]'],
			},
		},
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
				fetchUrl="admin/entity/VotesLog"
		/>
	</div>
</template>
