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
	pagination: {
		type: Object,
	},
});

import { filters } from '@/composables/filters/filters.js';
const { setFilter, checkHasFilters } = filters();
</script>

<template>
	<div>
		<Search
				class="mb-4 lg:flex"
				:entity="entity"
		/>

		<OpeningBox
				title="Фильтры"
				:useHardDisable="true"
				:defaultContentStatus="checkHasFilters(entity)"
		>
			<Filter
					:entity="entity"
					:showByFirstDateCheckbox="true"
			/>
		</OpeningBox>

		<Sort
				:entity="entity"
				:pagination="pagination"
		/>
	</div>
</template>
