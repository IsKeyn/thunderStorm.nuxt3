<script setup>
import GamblingGame from '@/components/boardGame/inventory/GamblingGame.vue'

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js';
import { computed } from "vue";
const { sendApiRequest, preparedRequestBody } = api();

const props = defineProps({});

const route = useRoute();
const requestName = 'getBoardGameItemList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/item/list/${route.params.slug}/`, 'GET', {}, requestName, '')
			);

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);
</script>

<template>
	<button @click="refresh">sfd</button>
	<h2 class="inv-title">Рулетка предметов</h2>
	<GamblingGame
			v-if="fetchedData.length > 0"
			:items="fetchedData"
			:boardGameId="boardGameStore.boardGameInfo.id"
			@setOpenedImage="setOpenedImage"
			@addItemToInventory="addItemToInventoryEmit"
	/>
</template>

<style lang="scss" scoped>

</style>
