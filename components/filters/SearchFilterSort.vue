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
	pagination: {
		type: Object,
	},
	type: {
		type: String,
		default: null,
	},
	usedFilters: {
		type: Array,
		default: [
			{
				name: 'gamePlatforms',
				langName: 'Игровые платформы',
				type: 'multiselect',
				requestData: true,
			},
			{
				name: 'genres',
				langName: 'Жанры',
				type: 'multiselect',
				requestData: true,
			},
			{
				name: 'companies',
				langName: 'Компании',
				type: 'multiselect',
				requestData: true,
			},
			{
				name: 'tags',
				langName: 'Теги',
				type: 'curtained',
				requestData: true,
			},
		],
	},
});

import { filters } from '@/composables/filters/filters.js';
const { checkHasFilters } = filters();
</script>

<template>
	<div>
		<Search
				class="mb-4 lg:flex"
				:entity="entity"
				:filterName="filterName"
		/>

		<OpeningBox
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
			/>
		</OpeningBox>

		<Sort
				:entity="entity"
				:filterName="filterName"
				:pagination="pagination"
		/>
	</div>
</template>
