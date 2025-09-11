<script setup>
import { inject } from 'vue'
const boardGameInfo = inject('boardGameInfo')

const route = useRoute();

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameInfo.value.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});


</script>

<template>
	<layout-PageHeader
			:title="boardGameInfo.name"
			:breadCrumbs="breadCrumbsArray"
	/>
	Информация игры для главной страницы

	Если до старта игры ещё есть время показывать промо страницу

	Если игра идет показывать пошаговый ход

	Если игра законченна, то показывать страницу благодарностей и победителей
</template>
