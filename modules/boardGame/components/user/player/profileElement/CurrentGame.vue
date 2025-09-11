<script setup>
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';

import { api } from '@/composables/api.js';
import {computed} from "vue";
const { sendApiRequest, preparedRequestBody } = api();

const props = defineProps({
	userName: {
		type: String,
		default: '',
	},
});

const route = useRoute();
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
	<ui-BigPreloader v-if="requestInProgress" />
	<template v-else-if="fetchedData && fetchedData.length > 0">
		<div v-for="(element, key) in fetchedData" :key="key">
			<GameCard :element="element"/>
		</div>
	</template>
	<template v-else>
		Текущая игра отсутствует
	</template>
</template>

<style lang="scss" scoped>
</style>
