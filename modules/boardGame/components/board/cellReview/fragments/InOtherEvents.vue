<script setup>
import Pagination from '@/components/navigation/Pagination.vue';
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';

import { computed, watch } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

const props = defineProps({
	eventSlug: {
		type: String,
		default: null,
	},
	// gameSlug: {
	// 	type: String,
	// 	default: null,
	// },
	perPage: {
		type: Number,
		default: 10,
	},
	contentBlockClass: {
		type: String,
		default: 'in-other-event-list-content',
	},
	element: {
		type: Object,
		default: {},
		required: true,
	},
});

import { pagination } from '@/composables/ui/pagination.js'
const {
	page,
	perPage,
	scrollAfterLoad,
	setRefresh,
	changePage,
	setPerPage
} = pagination(props.perPage);

const requestName = 'other_player_actions_with_game_in_event_' + props.eventSlug + '_' + props.gameSlug;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.eventSlug && props.element.boardPositionEffect.id) {
				const query = {
					page: page.value,
					perPage: perPage.value,
				};

				const response = await Promise.resolve(
						sendApiRequest(
								`board-game/v2/board-cell/get-other-event-review/${props.eventSlug}/${props.element.boardPositionEffect.id}`,
								'GET',
								query,
								requestName,
								''
						)
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || []);
const paginationData = computed(() => requestData.value?.meta || null);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);

watch(
		() => [fetchedData.value, requestInProgress.value],
		async ([newData, isPending]) => {
			// Ждем, пока данные загрузятся И прелоадер исчезнет
			if (scrollAfterLoad.value && newData && newData.length && !isPending) {
				await nextTick();

				setTimeout(() => {
					scrollToElement(`.${props.contentBlockClass}`);
					scrollAfterLoad.value = false;
				}, 50);
			}
		},
		{ deep: true }
);
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData && fetchedData.length">
		<div :class="[contentBlockClass]">
			<GameCard
					v-if="fetchedData.length > 0"
					v-for="(element, key) in fetchedData"
					:key="key"
					:element="element"
					theme="PlayerActionWithGame"
					:showCover="false"
					timeName="затраченное время"
			/>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="На других ивентах отзывов об этой игровой ячейки нет"
	/>

	<Pagination
			v-if="paginationData"
			:pagination="paginationData"
			:navigationButtons="true"
			:perPageOptionsProp="[10, 20, 40]"
			:setQueryParams="false"
			@changePage="changePage"
			@setPerPage="setPerPage"
	/>
</template>

<style lang="scss" scoped>
.game-count-line {
	@apply block lg:flex justify-center;

	span {
		@apply block lg:inline mr-[1.5rem];
	}
}
</style>
