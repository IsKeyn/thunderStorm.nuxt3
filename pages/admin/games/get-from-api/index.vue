<script setup>
definePageMeta({
	layout: 'admin',
});

import PageHeader from '@/components/layout/PageHeader.vue';
import AddGameFromApiForm from '@/components/forms/AddGameFromApiForm.vue';
import Head from '@/components/seo/Head.vue';

const route = useRoute();

const title = 'Игры';
const pageTitle = 'Добавление игры из API';

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: 'Админ панель',
			href: `/${splitedPath[1]}`,
		},
		{
			name: title,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: pageTitle,
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<div>
		<PageHeader
				:title="title"
				:breadCrumbs="breadCrumbsArray"
		/>
		<AddGameFromApiForm />
		<Head :seo="{ title: pageTitle  }" />
	</div>
</template>

<style lang="scss" scoped></style>
