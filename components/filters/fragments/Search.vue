<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilter } = filters();

import { helper } from '@/composables/helper.js';
const { setQueryParam } = helper();

const props = defineProps({
	useSearchButton: {
		type: Boolean,
		default: false,
	},
	entity: {
		type: String,
		default: 'game',
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
	keyForFilter: {
		type: String,
		default: 'search',
	},
});

const searchLine = ref({
		name: 'Поиск',
		value: '',
		type: 'text',
		placeholder: 'Поиск',
		classes: 'w-full',
});

watch(() => filtersStore.filters?.[props.entity]?.[props.keyForFilter], () => {
	if (searchLine.value.value !== filtersStore.filters?.[props.entity]?.[props.keyForFilter]) {
		searchLine.value.value = filtersStore.filters?.[props.entity]?.[props.keyForFilter]
	}
}, { deep: true, immediate: true });

const search = () => {
	if (props.setQueryParams) {
		setQueryParam([props.keyForFilter], searchLine.value.value);
	}

	setFilter({ [props.keyForFilter]: searchLine.value.value }, props.entity);
}

if (!props.useSearchButton) {
	watch(searchLine.value, () => {
		searchStart();
	}, { deep: true });

	const searchTimeout = ref(null);

	const searchStart = () => {
		clearTimeout(searchTimeout.value);

		searchTimeout.value = setTimeout(() => {
			search();
		}, 500);
	}
}
</script>

<template>
	<form @submit.prevent="useSearchButton ? search() : null">
		<FormGenerator
				v-if="searchLine"
				name="searchLine"
				:element="searchLine"
				class="w-full"
				:showTitle="false"
				:clearButton="true"
				validateErrorPosition="bottom"
				labelClasses="block lg:inline mt-[10px] mb-4 lg:mb-[10px]"
				:fieldClasses="searchLine.classes"
		/>
		<layout-buttons-ActionButton
				v-if="useSearchButton"
				buttonClasses="btn btn-simple-1"
				buttonName="Искать"
				:actionInProgress="requestInProgress"
		/>
	</form>
</template>
