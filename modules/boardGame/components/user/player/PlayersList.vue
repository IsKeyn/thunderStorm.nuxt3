<script setup>
import PlayerCardV2 from '@/modules/boardGame/components/user/player/playerCards/PlayerCardV2.vue';
import SearchFilterSort from '@/components/filters/SearchFilterSort.vue';
import Pagination from '@/components/navigation/Pagination.vue';
import PublicRecommendation from '@/components/recommendation/PublicRecommendation.vue';

import { computed, ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { filters } from '@/composables/filters/filters.js';
const {
	setFilterName,
	setFilter,
	setQueryFilters,
} = filters();

const props = defineProps({
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
	}
});

import { pagination } from '@/composables/ui/pagination.js'
const {
	page,
	perPage,
	setRefresh,
	changePage,
	setPerPage
} = pagination(props.perPage);

const filterName = setFilterName([ 'list', props.fetchUrl ]);

// Устанавливаем фильтры их get параметров
setQueryFilters(filterName, props.usedFilters, props.defaultFilters);

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
</script>

<template>
	<div class="relative">
		<SearchFilterSort
				:entity="props.entity"
				filterRequestUrl="board-game/v2/player/filters"
				:filterName="filterName"
				:total="paginationData?.total"
				type="public"
				:usedFilters="usedFilters"
				:sortOptions="sortOptions"
		/>
		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<div v-else-if="fetchedData && fetchedData.length">
			<div
					v-for="(player, index) in fetchedData"
					:key="player.id || index"
			>
				<PlayerCardV2 :element="player" />
			</div>
		</div>
		<ui-itemBox
				v-else
				classes="red"
		/>
		<Pagination
				v-if="paginationData"
				:pagination="paginationData"
				:navigationButtons="true"
				:perPageOptionsProp="[15, 30, 45]"
				@changePage="changePage"
				@setPerPage="setPerPage"
		/>
		<PublicRecommendation />
	</div>
</template>

<style lang="scss" scoped />
