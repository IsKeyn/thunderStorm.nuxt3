<script setup>
import Card from '@/modules/boardGame/components/boardGame/Card.vue';

import { computed, watch } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({
	userName: {
		type: String,
		default: null,
	},
});

const route = useRoute();
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

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

watch(() => props.userName, () => {
	refresh();
}, { deep: true });
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<template v-else-if="fetchedData && fetchedData.length > 0">
		<Card
				v-for="(boardGame, key) in fetchedData"
				:key="key"
				:element="boardGame"
		/>
	</template>
	<template v-else>
		Не участвовал в других ивентах
	</template>
</template>

<style lang="scss" scoped></style>
