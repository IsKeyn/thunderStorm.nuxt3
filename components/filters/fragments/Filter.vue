<script setup>
import RangeFilter from '@/components/filters/fragments/RangeFilter.vue';
import SelectsAndTags from '@/components/filters/fragments/SelectsAndTags.vue';
import TagsList from '@/components/tags/TagsList.vue';
import FilterList from '@/components/filters/fragments/FilterList.vue';

import { computed } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilterName, clearFilters, checkHasFilters } = filters();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const props = defineProps({
	entity: {
		type: String,
		default: 'game',
	},
	filterName: {
		type: String,
		default: null,
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
	usedFilters: {
		type: Array,
		default: [],
	},
	useRange: {
		type: Boolean,
		default: true,
	},
	showClearButton: {
		type: Boolean,
		default: false,
	},

	/* Тип фильтра публичный\админка */
	type: {
		type: String,
		default: null,
	},
});

const filterName = props.filterName ? props.filterName : setFilterName([ props.entity ]);

const requestName =  filterName + 'TakeFilters';

const getFilterList = () => {
	const result = [];

	if (props.usedFilters && props.usedFilters.length > 0) {
		props.usedFilters.forEach((item) => {
			if (item.name && item.requestData) {
				result.push(item.name);
			}
		});
	}

	if (props.useRange) {
		result.push('minMaxData');
	}

	return JSON.stringify(result);
}

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				filters: filtersStore.filters[filterName],
				filterList: getFilterList(),
			};

			if (props.type === 'public') {
				query.active = true
			}

			const response = await Promise.resolve(
					sendApiRequest(`${props.entity}/filters`, 'GET', query, requestName, '')
			);

			return response || null;
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
	<div v-else-if="fetchedData">
		<RangeFilter
				v-if="useRange && fetchedData.minMaxData"
				:entity="entity"
				:filterName="filterName"
				:setQueryParams="setQueryParams"
				:fetchedData="fetchedData"
		/>

		<SelectsAndTags
				:entity="entity"
				:filterName="filterName"
				:setQueryParams="setQueryParams"
				:fetchedData="fetchedData"
				:usedFilters="usedFilters"
		/>

		<div
				v-if="showClearButton && checkHasFilters(filterName)"
				class="flex justify-end"
		>
			<layout-buttons-ActionButton
					buttonClasses="btn btn-simple-1"
					buttonName="Сбросить фильтры"
					:actionInProgress="requestInProgress"
					@startAction="clearFilters(filterName)"
			/>
		</div>

		<FilterList
				class="mt-4"
				:entity="entity"
				:filterName="filterName"
				:dataForFilters="fetchedData"
		/>
	</div>
</template>

<style lang="scss" scoped />
