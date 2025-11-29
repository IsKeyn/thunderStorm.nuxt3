<script setup>
definePageMeta({
	layout: 'admin',
});

import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';
import AddGameFromApiForm from '@/components/forms/AddGameFromApiForm.vue';

const route = useRoute();

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: 'Админ панель',
			href: `/${splitedPath[1]}`,
		},
		{
			name: 'Игры',
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: 'Добавление игры из API',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<div>
		<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
		<AddGameFromApiForm />
	</div>
</template>

<style lang="scss" scoped></style>
