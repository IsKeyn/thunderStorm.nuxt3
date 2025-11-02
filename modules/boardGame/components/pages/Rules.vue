<script setup>
import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const route = useRoute();

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo?.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: 'Правила и описание',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});


</script>

<template>
	<layout-PageHeader
			title="Правила и описание"
			:breadCrumbs="breadCrumbsArray"
	/>
	<articles-ArticleDetail
			:entityType="boardGameStore.boardGameInfo.entity_type"
			:entityId="boardGameStore.boardGameInfo.id"
			:sendFullPath="false"
			:showPageHeader="false"
	/>
</template>
