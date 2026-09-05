<script setup>
import PlayerCardV2 from '@/modules/boardGame/components/user/player/playerCards/PlayerCardV2.vue';
import SearchFilterSort from '@/components/filters/SearchFilterSort.vue';
import Pagination from '@/components/navigation/Pagination.vue';
import PublicRecommendation from '@/components/recommendation/PublicRecommendation.vue';

import { computed, ref, watch } from "vue";

const emit = defineEmits(['onClickFunc']);

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

import { filters } from '@/composables/filters/filters.js';
const {
	setFilterName,
	setFilter,
	setQueryFilters,
	storeDefaultFilters,
} = filters();

const props = defineProps({
	filterNamePostfix: {
		type: String,
		default: 'players_default',
	},
	perPage: {
		type: Number,
		default: 15,
	},
	entity: {
		type: String,
		required: true,
	},
	usedFilters: {
		type: Array,
		default: [],
	},
	defaultFilters: {
		type: Object,
		default: {},
	},
	sortOptions: {
		type: Array,
		default: [],
	},
	showPagination: {
		type: Boolean,
		required: true,
	},
	showFilters: {
		type: Boolean,
		required: true,
	},
	/* Действие при нажатии route, emit */
	clickDoType: {
		type: String,
		default: 'route',
	},
	/* Отображать блок выбора случайного игрока */
	showSelectRandomPlayer: {
		type: Boolean,
		default: false,
	},
	contentBlockClass: {
		type: String,
		default: 'player-list-content',
	}
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

const filterName = setFilterName([ 'list', props.filterNamePostfix ]);

// Устанавливаем фильтры их get параметров
setQueryFilters(filterName, props.usedFilters, props.defaultFilters);
/* Записываем дефолтные фильтры в store */
storeDefaultFilters(filterName, props.defaultFilters);

const requestName = 'getBoardGamePlayerList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				page: page.value,
				perPage: perPage.value,
				filters: filtersStore.filters[filterName],
			};

			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player/list/${route.params.slug}`, 'GET', query, requestName)
			);

			return response || null;
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

/* НАЧАЛО: Фильтры */
let oldFilter = filtersStore.filters[filterName] ?? {};

const updateDataWithFilters = () => {
	if (JSON.stringify(oldFilter) !== JSON.stringify(filtersStore.filters?.[filterName])) {
		oldFilter = filtersStore.filters?.[filterName];
		page.value = 1;
		refresh();
	}
}

// Отслеживаем нажатие кнопок назад\вперед в браузере, для обновления фильтра, в случае изменении get параметров
const isBrowserNavigation = ref(false);
const handlePopState = async () => { isBrowserNavigation.value = true; };

onMounted(() => { window.addEventListener('popstate', handlePopState); });
onUnmounted(() => { window.removeEventListener('popstate', handlePopState); });

watch(() => route.query, async () => {
	/* TODO на данный момент нет решения без таймаута, проблема в том, что сначала срабатывает данный watch, а потом событие popstate */
	setTimeout(() => {
		if (isBrowserNavigation.value) {
			isBrowserNavigation.value = false;
			setQueryFilters(filterName);
			updateDataWithFilters();
		}
	}, 100)}, { deep: true }
);

watch(() => filtersStore.filters?.[filterName], () => {
	updateDataWithFilters();
}, { deep: true });

/* КОНЕЦ: Фильтры */

/* Данный для случайного игрока */
const dataForRandomPlayer = {
	type: 'randomPlayer',
	model: 'App\\Models\\BoardGame\\BoardGamePlayer',
	user: {
		name: "Случайный игрок",
		public_name: "Случайный игрок",
		avatar: null,
	},
	points: '???',
	full_points: '????',
	points_per_hour: '??',
	streak: '?',
	step_count: '?',
	item_roll_count: '?',
	finishBoard: false,
	position: '??',
	place: '?',
};

const showRecommendationBlock = computed(() => {
	return getSettingValue('show_recommendation_block');
});

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
	<div class="relative">
		<SearchFilterSort
				v-if="showFilters"
				:entity="props.entity"
				filterRequestUrl="board-game/v2/player/filters"
				:filterName="filterName"
				:total="paginationData?.total"
				type="public"
				:usedFilters="usedFilters"
				:sortOptions="sortOptions"
				:showOpeningBox="false"
		/>
		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<div
				v-else-if="fetchedData && fetchedData.length"
				:class="[contentBlockClass]"
		>
			<div v-if="showSelectRandomPlayer">
				<PlayerCardV2
						:element="dataForRandomPlayer"
						:clickDoType="clickDoType"
						@onClickFunc="$emit('onClickFunc', $event)"
				/>
			</div>
			<div
					v-for="(player, index) in fetchedData"
					:key="player.id || index"
			>
				<PlayerCardV2
						:element="player"
						:clickDoType="clickDoType"
						@onClickFunc="$emit('onClickFunc', $event)"
				/>
			</div>
		</div>
		<ui-itemBox
				v-else
				classes="red"
		/>
		<Pagination
				v-if="showPagination && paginationData"
				:pagination="paginationData"
				:navigationButtons="true"
				:perPageOptionsProp="[15, 30, 45]"
				@changePage="changePage"
				@setPerPage="setPerPage"
		/>
		<PublicRecommendation v-if="showRecommendationBlock" />
	</div>
</template>

<style lang="scss" scoped />
