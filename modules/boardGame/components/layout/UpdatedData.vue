<script setup>
import { onMounted } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

const requestName = 'boardGameStreamersOnlineKey';

const getUpdatedData = async() => {
	const response = await sendApiRequest(
			'board-game/getStreamersOnline',
			'GET',
			{ boardGameId: boardGameStore.boardGameInfo.id },
			requestName,
			null
	);

	boardGameStore.playersOnline = response;
}

watch(() => boardGameStore.boardGameInfo, () => {
	if (boardGameStore.boardGameInfo && boardGameStore.boardGameInfo.id) {
		getUpdatedData();
	}
}, { deep: true });

onMounted(() => {
	if (boardGameStore.boardGameInfo && boardGameStore.boardGameInfo.id) {
		getUpdatedData();
	}

	setInterval(() => {
		getUpdatedData();
	}, 300000);
});
</script>

<template></template>

<style lang="scss" scoped></style>
