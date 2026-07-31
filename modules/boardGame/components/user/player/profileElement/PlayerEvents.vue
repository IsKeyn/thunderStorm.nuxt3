<script setup>
import Card from '@/modules/boardGame/components/boardGame/Card.vue';

import { computed } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({
	userName: {
		type: String,
		default: null,
	},
});

const requestName = 'getBoardGamePlayerEvents';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/getEvents/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<Card
			v-else-if="fetchedData && fetchedData.length"
			v-for="(boardGame, key) in fetchedData"
			:key="key"
			:element="boardGame"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="Не участвовал в других ивентах"
	/>
</template>

<style lang="scss" scoped></style>
