<script setup>
import Card from '@/modules/boardGame/components/boardGame/Card.vue';

import { computed } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const route = useRoute();
const requestName = 'getBoardGameList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest('board-game/v2/list', 'GET', {}, requestName, '')
			);

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const list = computed(() => requestData.value || null);
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<Card
			v-else
			v-for="(boardGame, key) in list"
			:key="key"
			:element="boardGame"
	/>
</template>

<style lang="scss" scoped></style>
