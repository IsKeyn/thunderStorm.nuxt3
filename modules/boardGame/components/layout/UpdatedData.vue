<script setup>
import { onMounted } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();
/* TODO надо как-то очищать BoardGameStorage при смене игры */

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

const props = defineProps({
	boardGameInfo: {
		type: Object,
		default: {},
		require: true,
	},
});

const requestName = 'boardGameStreamersOnlineKey';

const getUpdatedData = async() => {
	const response = await sendApiRequest(
			'board-game/getStreamersOnline',
			'GET',
			{ boardGameId: props.boardGameInfo.id },
			requestName,
			null
	);

	boardGameStore.playersOnline = response;
}

watch(() => props.boardGameInfo, () => {
	if (props.boardGameInfo && props.boardGameInfo.id) {
		getUpdatedData();
	}
}, { deep: true });

onMounted(() => {
	if (props.boardGameInfo && props.boardGameInfo.id) {
		getUpdatedData();
	}

	setInterval(() => {
		getUpdatedData();
	}, 300000);
});
</script>

<template></template>

<style lang="scss" scoped></style>
