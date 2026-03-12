<script setup>
import RangeFilter from '@/components/filters/fragments/RangeFilter.vue';
import SelectsAndTags from '@/components/filters/fragments/SelectsAndTags.vue';
import TagsList from '@/components/tags/TagsList.vue';
import FilterList from '@/components/filters/fragments/FilterList.vue';

import { computed } from "vue";

import { filters } from '@/composables/filters/filters.js';
const { clearFilters, checkHasFilters } = filters();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const props = defineProps({
	entity: {
		type: String,
		default: 'game',
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
	showRange: {
		type: Boolean,
		default: true,
	},
	showClearButton: {
		type: Boolean,
		default: false,
	},
});

const requestName =  props.entity + 'TakeFilters';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {};

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
				v-if="showRange && fetchedData.minMaxData"
				:entity="entity"
				:setQueryParams="setQueryParams"
				:fetchedData="fetchedData"
		/>

		<SelectsAndTags
				:entity="entity"
				:setQueryParams="setQueryParams"
				:fetchedData="fetchedData"
				:usedFilters="usedFilters"
		/>

		<div
				v-if="showClearButton && checkHasFilters(entity)"
				class="flex justify-end"
		>
			<layout-buttons-ActionButton
					buttonClasses="btn btn-simple-1"
					buttonName="Сбросить фильтры"
					:actionInProgress="requestInProgress"
					@startAction="clearFilters(entity)"
			/>
		</div>

		<FilterList
				class="mt-4"
				:entity="entity"
				:dataForFilters="fetchedData"
		/>
	</div>
</template>

<style lang="scss" scoped />
