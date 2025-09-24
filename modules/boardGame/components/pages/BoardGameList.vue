<script setup>
import List from '@/modules/boardGame/components/boardGame/List.vue';

const route = useRoute();

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: 'Ивенты',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});
</script>

<template>
	<layout-PageHeader
			title="Список ивентов"
			:breadCrumbs="breadCrumbsArray"
	/>
	<List />
</template>
