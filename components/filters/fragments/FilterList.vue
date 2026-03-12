<script setup>
import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilter, clearFilters, checkHasFilters } = filters();

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
				name: 'Дата релиза',
				value: 'date',
			},
			{
				name: 'Дата публикации',
				value: 'created_at',
			},
		],
	},
	exceptions: {
		type: Array,
		default: ['by_first_date', 'sort'],
	}
});

const activeFiltersList = computed(() => {
	let result = [];

	if (filtersStore.filters?.[props.entity]) {
		if (!props.exceptions.includes('search') && filtersStore.filters[props.entity].search) {
			result.push({
				name: filtersStore.filters[props.entity].search,
				value: filtersStore.filters[props.entity].search,
				key: 'search',
			});
		}

		if (!props.exceptions.includes('by_first_date') && filtersStore.filters[props.entity].by_first_date) {
			result.push({
				name: 'По первой дате',
				value: filtersStore.filters[props.entity].by_first_date,
				key: 'by_first_date',
			});
		}

		if (!props.exceptions.includes('date_min') && filtersStore.filters[props.entity].date_min) {
			result.push({
				name: filtersStore.filters[props.entity].date_min,
				value: filtersStore.filters[props.entity].date_min,
				key: 'date_min',
			});
		}

		if (!props.exceptions.includes('date_max') && filtersStore.filters[props.entity].date_max) {
			result.push({
				name: filtersStore.filters[props.entity].date_max,
				value: filtersStore.filters[props.entity].date_max,
				key: 'date_max',
			});
		}

		props.usedFilters.forEach((item) => {
			if (!props.exceptions.includes(item.name) && filtersStore.filters[props.entity][item.name]) {
				if (filtersStore.filters[props.entity][item.name].length > 0) {
					filtersStore.filters[props.entity][item.name].forEach((value) => {
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
				&& filtersStore.filters[props.entity].sort
				&& filtersStore.filters[props.entity].sort.field)
		{
			const element = filterByPairFieldValue(props.sortOptions, 'value', filtersStore.filters[props.entity].sort.field, true);

			result.push({
				name: 'Сортировка по: ' + (element?.name ? element?.name : 'не определенное значение') + ' (' + (filtersStore.filters[props.entity].sort.sort === 'asc' ? 'возрастанию' : 'убыванию') + ')',
				value: filtersStore.filters[props.entity].sort,
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
			&& filtersStore.filters[props.entity][filterForDelete[0].name])
	{
		const finalValue = filtersStore.filters[props.entity][filterForDelete[0].name].filter((item) => item !== value);
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
		setFilter(filterResult, props.entity);
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
					v-if="checkHasFilters(entity)"
					buttonClasses="btn btn-simple-1"
					buttonName="Сбросить фильтры"
					@startAction="clearFilters(entity)"
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
