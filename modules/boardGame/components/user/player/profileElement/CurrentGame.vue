<script setup>
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';

import { computed } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	userName: {
		type: String,
		default: null,
	},
});

const requestName = 'getBoardGamePlayerCurrentGame';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/getCurrentGame/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, '')
				);

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<GameCard
			v-else-if="fetchedData && fetchedData.length"
			v-for="(element, key) in fetchedData"
			:key="key"
			:element="element"
	/>
	<ui-itemBox
			v-else
			classes="red"
			message="Текущая игра отсутствует"
	/>
</template>

<style lang="scss" scoped />
