<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import SearchFilterSort from '@/components/filters/SearchFilterSort.vue';
import ListCard from '@/components/entity/card/ListCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';
import PublicRecommendation from '@/components/recommendation/PublicRecommendation.vue';
import GamblingGameV2_1 from '@/components/games/gamblingGame/GamblingGameV2_1.vue'

import { computed, ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { filters } from '@/composables/filters/filters.js';
const {
	setFilterName,
	setFilter,
	setQueryFilters,
} = filters();

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		default: 'Рулетка',
	},
	subName: {
		type: String,
		default: 'Равлекательный контент',
	},
	title: {
		type: String,
		default: 'Список развлекательного контента',
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
		default: [
			{
				name: 'Сортировка',
				value: 'sort',
			},
			{
				name: 'Название',
				value: 'name',
			},
			{
				name: 'Лайки',
				value: 'likes',
			},
			{
				name: 'Просмотры',
				value: 'views',
			},
			{
				name: 'Дата публикации',
				value: 'created_at',
			},
		],
	}
});

const filterName = setFilterName([ 'list', props.fetchUrl ]);

// Устанавливаем фильтры их get параметров
setQueryFilters(filterName, props.usedFilters, props.defaultFilters);

const requestName =  props.entity + 'EntityList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = { filters: filtersStore.filters[filterName] };

			const response = await Promise.resolve(
					sendApiRequest(`${props.entity}/roll/list`, 'GET', query, requestName, '')
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

/* НАЧАЛО: Фильтры */
let oldFilter = filtersStore.filters[filterName] ?? {};

const updateDataWithFilters = () => {
	if (JSON.stringify(oldFilter) !== JSON.stringify(filtersStore.filters?.[filterName])) {
		oldFilter = filtersStore.filters?.[filterName];
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

const getBreadCrumbs = () => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.subName,
			href: `/${splitedPath[1]}/`,
		},
		{
			name: props.name,
			href: `/${splitedPath[2]}/`,
		},
	];
}

const dataByGroups = computed(() => {
	let returnData = [];
	let preparedData = {};

	if (fetchedData.value) {
		fetchedData.value.forEach((item) => {
			if (!item.groups || item.groups.length === 0) {
				if (!preparedData.hasOwnProperty('emptyGroup')) {
					preparedData.emptyGroup = {
						name: 'Без группы',
						sort: 9999,
						items: [],
					};
				}

				preparedData.emptyGroup.items.push(item);
			} else {
				item.groups.forEach((it) => {
					if (!preparedData.hasOwnProperty(it.slug)) {
						preparedData[it.slug] = {
							name: it.name,
							sort: it.sort,
							items: [],
						};
					}

					preparedData[it.slug].items.push(item);
				});
			}
		});
	}

	for (let key in preparedData) {
		returnData.push(preparedData[key]);
	}

	returnData.sort(function(a, b) {
		return a.sort - b.sort;
	});

	return returnData;
});

const spinning = ref(false);

const setStatus = (status) => {
	if (status === 'start') {
		spinning.value = true;
		return;
	}

	if (status === 'finish') {
		spinning.value = false;
		return;
	}
}
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="getBreadCrumbs()"
	/>
	<SearchFilterSort
			:entity="props.entity"
			:filterName="filterName"
			:total="fetchedData.length"
			type="public"
			:usedFilters="usedFilters"
			:showSort="false"
			:disable="spinning"
	/>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData && fetchedData.length > 0">
		<GamblingGameV2_1
				v-if="fetchedData"
				:items="fetchedData"
				:roll_count="1"
				:requestParentData="requestInProgress"
				cardType="Game"
				:itemHeight="130"
				:showItemCount="true"
				@setStatus="setStatus"
		/>
	</div>
	<ui-itemBox
			v-else
			classes="red"
	/>
	<PublicRecommendation />
</template>

<style scoped lang="scss">
.group {
	@apply mb-10;
}

.game-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];
}
</style>
