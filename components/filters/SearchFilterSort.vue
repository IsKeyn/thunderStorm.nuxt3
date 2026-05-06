<script setup>
import Search from '@/components/filters/fragments/Search.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';
import Filter from '@/components/filters/fragments/Filter.vue';
import Sort from '@/components/filters/fragments/Sort.vue';

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	filterName: {
		type: String,
		default: null,
	},
	total: {
		type: Number,
		default: null,
	},
	type: {
		type: String,
		default: null,
	},
	usedFilters: {
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
	},
	showSort: {
		type: Boolean,
		default: true,
	},
	disable: {
		type: Boolean,
		default: true,
	},
});

import { filters } from '@/composables/filters/filters.js';
const { checkHasFilters } = filters();
</script>

<template>
	<div class="relative">
		<ui-fragments-DisableBox
				v-if="disable"
				:showIcon="false"
		/>
		<Search
				class="mb-4 lg:flex"
				:entity="entity"
				:filterName="filterName"
		/>

		<OpeningBox
				v-if="usedFilters.length"
				title="Фильтры"
				:useHardDisable="true"
				:defaultContentStatus="checkHasFilters(filterName, usedFilters)"
		>
			<Filter
					:entity="entity"
					:filterName="filterName"
					:showByFirstDateCheckbox="true"
					:type="type"
					:usedFilters="usedFilters"
					:sortOptions="sortOptions"
			/>
		</OpeningBox>

		<Sort
				v-if="showSort"
				:entity="entity"
				:filterName="filterName"
				:sortOptions="sortOptions"
				:total="total"
		/>
	</div>
</template>
