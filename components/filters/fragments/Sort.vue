<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilterName, setFilter } = filters();

import { helper } from '@/composables/helper.js'
const { setQueryParam } = helper();

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
	defaultSortValue: {
		type: String,
		default: 'sort',
	},
	defaultSortDirection: {
		type: String,
		default: 'asc',
	},
	pagination: {
		type: Object,
	},
});

const filterName = props.filterName ? props.filterName : setFilterName([ props.entity ]);

const sort = ref(
	{
		name: '',
		value: filtersStore.filters?.[filterName]?.sort?.field ? filtersStore.filters?.[filterName].sort.field : props.defaultSortValue,
		type: 'select',
		options: props.sortOptions,
		validateRules: 'required',
		classes: ['w-full', 'mt-[5px]'],
	}
);

const sortDirection = ref(filtersStore.filters?.[filterName]?.sort?.sort ? filtersStore.filters?.[filterName].sort.sort : props.defaultSortDirection);

const setSort = () => {
	if (
			!filtersStore.filters?.[filterName]?.sort
			&& (sort.value.value === props.defaultSortValue && sortDirection.value === props.defaultSortDirection)
	) {
		return false;
	}

	const sortData = {
		field: sort.value.value,
		sort: sortDirection.value,
	};

	if (props.setQueryParams) {
		setQueryParam('sort', JSON.stringify(sortData));
	}

	setFilter({ sort: sortData }, filterName);
}

let oldSortValue = false;
let oldSortDirectionValue = false;

watch(() => filtersStore.filters?.[filterName]?.sort, () => {
	oldSortValue = sort.value.value;
	oldSortDirectionValue = sortDirection.value;

	sort.value.value = filtersStore.filters?.[filterName]?.sort?.field ? filtersStore.filters?.[filterName].sort.field : props.defaultSortValue;
	sortDirection.value = filtersStore.filters?.[filterName]?.sort?.sort ? filtersStore.filters?.[filterName].sort.sort : props.defaultSortDirection;
}, { deep: true });


watch(sort.value, () => {
	if (oldSortValue !== sort.value.value) {
		setSort();
	}
});

watch(sortDirection, () => {
	if (oldSortDirectionValue !== sortDirection.value) {
		setSort();
	}
});
</script>

<template>
	<div class="flex items-center justify-between w-full">
		<div v-if="pagination">
			Всего найдено: {{ pagination.total }}
		</div>

		<div class="flex items-center gap-2">
			<FormGenerator
					name="sort"
					:element="sort"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['inline-block', 'mb-[10px]', 'mr-2']"
					:fieldClasses="sort.classes"
			/>
			<button>
				<font-awesome-icon
						v-if="sortDirection === 'desc'"
						:icon="['fas', 'arrow-down-wide-short']"
						@click="sortDirection = 'asc'"
				/>
				<font-awesome-icon
						v-if="sortDirection === 'asc'"
						:icon="['fas', 'arrow-up-short-wide']"
						@click="sortDirection = 'desc'"
				/>
			</button>
		</div>
	</div>
</template>
