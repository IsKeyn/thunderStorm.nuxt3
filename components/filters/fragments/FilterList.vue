<script setup>
import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilterName, setFilter, clearFilters, checkHasFilters } = filters();

import { helper } from '@/composables/helper.js'
const {
	findElementById,
	filterByPairFieldValue,
	setQueryParam
} = helper();

const props = defineProps({
	entity: {
		type: String,
		default: 'game',
	},
	filterName: {
		type: String,
		default: null,
	},
	dataForFilters: {
		type: Object,
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
	usedFilters: {
		type: Array,
		default: [
			{
				name: 'gamePlatforms',
				langName: 'Игровые платформы',
				type: 'multiselect',
			},
			{
				name: 'genres',
				langName: 'Жанры',
				type: 'multiselect',
			},
			{
				name: 'companies',
				langName: 'Компании',
				type: 'multiselect',
			},
			{
				name: 'tags',
				langName: 'Теги',
				type: 'curtained',
			},
		],
	},
	sortOptions: {
		type: Array,
		default: [],
	},
	exceptions: {
		type: Array,
		default: ['by_first_date', 'sort'],
	}
});

const filterName = props.filterName ? props.filterName : setFilterName([ props.entity ]);

const activeFiltersList = computed(() => {
	let result = [];

	if (filtersStore.filters?.[filterName]) {
		if (!props.exceptions.includes('search') && filtersStore.filters[filterName].search) {
			result.push({
				name: filtersStore.filters[filterName].search,
				value: filtersStore.filters[filterName].search,
				key: 'search',
			});
		}

		if (!props.exceptions.includes('by_first_date') && filtersStore.filters[filterName].by_first_date) {
			result.push({
				name: 'По первой дате',
				value: filtersStore.filters[filterName].by_first_date,
				key: 'by_first_date',
			});
		}

		if (!props.exceptions.includes('date_min') && filtersStore.filters[filterName].date_min) {
			result.push({
				name: filtersStore.filters[filterName].date_min,
				value: filtersStore.filters[filterName].date_min,
				key: 'date_min',
			});
		}

		if (!props.exceptions.includes('date_max') && filtersStore.filters[filterName].date_max) {
			result.push({
				name: filtersStore.filters[filterName].date_max,
				value: filtersStore.filters[filterName].date_max,
				key: 'date_max',
			});
		}

		props.usedFilters.forEach((item) => {
			if (
					!props.exceptions.includes(item.name)
					&& filtersStore.filters[filterName][item.name]
			) {
				if (item.type === 'checkbox') {
					if (
							(typeof filtersStore.filters[filterName][item.name] === 'string' || typeof filtersStore.filters[filterName][item.name] === 'boolean')
							&& (filtersStore.filters[filterName][item.name] === 'true' || filtersStore.filters[filterName][item.name] === true)
					) {
						result.push({
							name: item.langName,
							value: true,
							key: item.name,
						});
					}
				}

				if (
						typeof filtersStore.filters[filterName][item.name] === 'object'
						&& filtersStore.filters[filterName][item.name].length > 0
				) {
					filtersStore.filters[filterName][item.name].forEach((value) => {
						result.push({
							name: item.name === 'tags' ? value : findNameByKeyAndId(item.name, value),
							value: value,
							key: item.name,
						});
					});
				}
			}
		});

		if (!props.exceptions.includes('sort')
				&& filtersStore.filters[filterName].sort
				&& filtersStore.filters[filterName].sort.field)
		{
			const element = filterByPairFieldValue(props.sortOptions, 'value', filtersStore.filters[filterName].sort.field, true);

			result.push({
				name: 'Сортировка по: ' + (element?.name ? element?.name : 'не определенное значение') + ' (' + (filtersStore.filters[filterName].sort.sort === 'asc' ? 'возрастанию' : 'убыванию') + ')',
				value: filtersStore.filters[filterName].sort,
				key: 'sort',
			});
		}
	}

	return result;
});

const findNameByKeyAndId = (key, id) => {
	let returnData = null;

	if (props.dataForFilters && props.dataForFilters[key]) {
		const element = findElementById(props.dataForFilters[key], id);

		if (element && element.name) {
			returnData = element.name;
		}
	}

	return returnData;
}

const deleteFilter = (key, value) => {
	const filterForDelete = props.usedFilters.filter((item) => item.name === key);
	let filterResult = null;
	let queryResult = null;

	if (
			filterForDelete.length > 0
			&& typeof filtersStore.filters[filterName][filterForDelete[0].name] === 'object'
			&& filtersStore.filters[filterName][filterForDelete[0].name])
	{
		const finalValue = filtersStore.filters[filterName][filterForDelete[0].name].filter((item) => item !== value);
		filterResult = { [key]: finalValue };
		queryResult = finalValue;
	} else {
		filterResult = { [key]: null };
		queryResult = null;
	}

	if (props.setQueryParams) {
		setQueryParam(key, queryResult);
	}

	if (filterResult) {
		setFilter(filterResult, filterName);
	}
}
</script>

<template>
	<div>
		<div>
			<span
					v-for="(option, key) in activeFiltersList"
					:key="key"
					class="multiselect-option-selected"
			>
				{{ option.name }} <font-awesome-icon @click="deleteFilter(option.key, option.value)" :icon="['fas', 'xmark']" class="cursor-pointer" />
			</span>
		</div>
		<div class="flex justify-end">
			<layout-buttons-ActionButton
					v-if="checkHasFilters(filterName, usedFilters)"
					buttonClasses="btn btn-simple-1"
					buttonName="Сбросить фильтры"
					@startAction="clearFilters(filterName, usedFilters)"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.multiselect-option-selected {
	@apply
		inline-block m-1 pr-2 pl-2 pt-1 pb-2
		bg-[var(--second-active-color)]
		rounded-full;
}
</style>
