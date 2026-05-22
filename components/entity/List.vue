<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import SearchFilterSort from '@/components/filters/SearchFilterSort.vue';
import ListCard from '@/components/entity/card/ListCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';
import PublicRecommendation from '@/components/recommendation/PublicRecommendation.vue';

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
		default: 'Равлекательный контент',
	},
	title: {
		type: String,
		default: 'Список развлекательного контента',
	},
	useGroups: {
		type: Boolean,
		default: false,
	},
	perPage: {
		type: Number,
		default: 24,
	},
	usedFilters: {
		type: Array,
		default: [],
	},
	defaultFilters: {
		type: Array,
		default: [],
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

const requestName =  props.entity + 'EntityList';

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
					sendApiRequest(`${props.entity}/list`, 'GET', query, requestName, '')
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

const getBreadCrumbs = () => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.name,
			href: `/${splitedPath[1]}/`,
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
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="getBreadCrumbs()"
	/>
	<SearchFilterSort
			:entity="props.entity"
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
		<template v-if="useGroups">
			<div v-if="dataByGroups">
					<div class="group" v-for="(group) in dataByGroups">
						<span class="title">{{ group.name }}</span>
						<div class="game-list">
							<ListCard
									v-for="(data, index) in group.items"
									:key="index"
									:data="data"
									:entity="entity"
							/>
						</div>
					</div>
			</div>
		</template>
		<template v-else>
			<div class="game-list">
				<ListCard
						v-for="(data, index) in fetchedData"
						:key="index"
						:data="data"
						:entity="entity"
				/>
			</div>
		</template>
	</div>
	<ui-itemBox
			v-else
			classes="red"
	/>
	<Pagination
			v-if="paginationData"
			:pagination="paginationData"
			:navigationButtons="true"
			:perPageOptionsProp="[24, 48, 96]"
			@changePage="changePage"
			@setPerPage="setPerPage"
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
