<script setup>
import Head from '@/components/seo/Head.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const seoData = computed(() => {
	const returnData = {};

	if (boardGameStore && Object.keys(boardGameStore.boardGameInfo).length > 0) {
		if (boardGameStore.boardGameInfo.name || boardGameStore.boardGameInfo?.seo?.name) {
			returnData.title = boardGameStore.boardGameInfo?.seo?.name ? boardGameStore.boardGameInfo.seo.name : boardGameStore.boardGameInfo.name;
		}

		if (boardGameStore.boardGameInfo.description || boardGameStore.boardGameInfo?.seo?.description) {
			returnData.description = boardGameStore.boardGameInfo?.seo?.description ? boardGameStore.boardGameInfo.seo.description : boardGameStore.boardGameInfo.description;
		}
	}

	return returnData;
});
</script>

<template>
	{{ boardGameStore.boardGameInfo.seo }}
	<Head :seo="seoData" />
</template>

<style lang="scss" scoped />
