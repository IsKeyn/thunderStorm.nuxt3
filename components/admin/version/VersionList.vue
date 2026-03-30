<script setup>
import EntityTable from '@/components/admin/tables/EntityTable.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import { computed, ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { filters } from '@/composables/filters/filters.js';
const {
	setFilter,
	setQueryFilters,
} = filters();

const props = defineProps({
	entityId: {
		type: Number,
		default: null,
	},
	entityType: {
		type: String,
		default: null,
	},
	perPage: {
		type: Number,
		default: 5,
	},
});

import { pagination } from '@/composables/ui/pagination.js'
const {
	page,
	perPage,
	setRefresh,
	changePage,
	setPerPage
} = pagination(props.perPage);

const filterName = computed(() => {
	return props.entityType + '_' + props.entityId;
});

// Устанавливаем фильтры их get параметров
setQueryFilters(filterName.value);

const requestName = 'getVersionList_' + props.entityType;

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
				entity_id: props.entityId,
				entity_type: props.entityType,
				filters: filtersStore.filters[filterName.value],
			};

			const response = await Promise.resolve(
					sendApiRequest(
						`admin/version/getByEntity`,
						'GET',
						query,
						requestName,
					)
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
let oldFilter = filtersStore.filters[filterName.value] ?? {};

const updateDataWithFilters = () => {
	if (JSON.stringify(oldFilter) !== JSON.stringify(filtersStore.filters?.[filterName.value])) {
		oldFilter = filtersStore.filters?.[filterName.value];
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
			setQueryFilters(filterName.value);
			updateDataWithFilters();
		}
	}, 100)}, { deep: true }
);

watch(() => filtersStore.filters?.[filterName.value], () => {
	updateDataWithFilters();
}, { deep: true });

/* КОНЕЦ: Фильтры */

const titles = {
	id: {
		name: 'id',
		sortable: true,
		type: 'rounded-box',
	},
	active: {
		name: 'Активность',
		type: 'boolean',
		sortable: true,
		classes: 'max-w-[30px]',
	},
	created_by: {
		name: 'Кем создан',
		type: 'EntityList',
		apiUrl: 'user/list',
		sortable: true,
	},
	created_at: {
		name: 'Дата создания',
		sortable: true,
	},
	doTypes: {
		name: 'Действия',
	},
};
</script>

<template>
	<div v-if="fetchedData && fetchedData.length > 0">
		<span class="sub-title">Версии</span>
		<div class="relative">
			<ui-BigPreloader
					v-if="requestInProgress"
					class="absolute w-full h-full bg-black/70"
					theme="image"
					:themeType="9"
			/>
			<EntityTable
					:titles="titles"
					:data="fetchedData"
					:entityId="entityId"
					:entityType="entityType"
			/>
			<Pagination
					v-if="paginationData"
					:pagination="paginationData"
					:navigationButtons="true"
					:perPageOptionsProp="[5, 15, 30]"
					@changePage="changePage"
					@setPerPage="setPerPage"
			/>
		</div>
	</div>
	<ui-BigPreloader
			v-else-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<ui-itemBox
			v-else
			message="Версии не найдены"
			borderColor="red"
	/>
</template>
