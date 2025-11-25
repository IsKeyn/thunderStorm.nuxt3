<script setup>
import PlayerInteractionCard from '@/modules/boardGame/components/player-interactions/PlayerInteractionCard.vue';

import { computed } from "vue";

const route = useRoute();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	userStore,
} = userFunctions();

const props = defineProps({
	classes: {
		type: String,
		default: null,
	},
});

const requestName = 'getBoardGamePlayerInteractions';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player/interactions/get/${route.params.slug}/`, 'GET', {}, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const incoming = computed(() => {
	return fetchedData.value?.interaction.filter(item => item.created_by !== userStore.user.id);
});

const outgoing = computed(() => {
	return fetchedData.value?.interaction.filter(item => item.created_by === userStore.user.id);
});

const description = 'Страница взаимодействия с другими игроками. На этой странице вы можете отслеживать свои запросы на взаимодействие с другими игроками, а также принимать решения о входящих предложениях.';
</script>

<template>
	<layout-InfoBlock
			:text="description"
			classes="!mb-6"
	/>
	<ui-BigPreloader v-if="requestInProgress" />
	<div class="item-box" v-else-if="fetchedData && fetchedData.status === 'error' && fetchedData.status_message">
		{{ fetchedData.status_message }}
	</div>
	<div
			v-else-if="fetchedData?.interaction.length > 0"
			:class="['interactions', classes]"
	>
		<div class="box mb-[2rem]">
			<h2 class="inv-title">Входящие запросы</h2>
			<span v-if="incoming.length === 0">Предметов нет</span>
			<div class="wrapper">
				<PlayerInteractionCard
						v-for="(element, key) in incoming"
						:key="key"
						:element="element"
						@update="refresh"
				/>
<!--				<ItemCard-->
<!--						v-for="(element, key) in fetchedData.filter(item => !item.has_used)"-->
<!--						:key="key"-->
<!--						:element="element.item"-->
<!--						:inventoryItem="element"-->
<!--						:useLightBox="true"-->
<!--						:showControlPanel="canUse"-->
<!--						@useItem="useItem"-->
<!--				/>-->
			</div>
		</div>
		<div class="box">
			<h2 class="inv-title">Исходящие запросы</h2>
			<span v-if="outgoing.length === 0">Предметов нет</span>
			<div class="wrapper">
				<PlayerInteractionCard
						v-for="(element, key) in outgoing"
						:key="key"
						:element="element"
						@update="refresh"
				/>
<!--				<ItemCard-->
<!--						v-for="(element, key) in usedItems"-->
<!--						:key="key"-->
<!--						:element="element.item"-->
<!--						:useLightBox="true"-->
<!--				/>-->
			</div>
		</div>
	</div>
	<template v-else>
		Взаимодействия отсутствуют
	</template>
</template>

<style lang="scss" scoped>
.interactions {
	@apply block lg:flex justify-center gap-4 mb-4;

	.box {
		@apply mb-[1rem] lg:mb-0 w-full lg:w-1/2;

		.wrapper {
			@apply h-[600px] overflow-auto;
		}
	}
}

.inv-title {
	@apply font-bold mb-4 uppercase;
}
</style>
