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
		{
			name: 'Обсуждение',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<layout-PageHeader
			title="Обсуждение"
			:breadCrumbs="breadCrumbsArray"
	/>
	<Comments
			entityType="App\Models\BoardGame"
			:entityId="boardGameInfo.id"
			:showAnswer="true"
	/>
</template>
