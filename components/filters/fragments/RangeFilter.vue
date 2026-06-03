<script setup>
import MinMaxRange from '@/components/ui/MinMaxRange.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilterName, setFilter } = filters();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

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
	showByFirstDateCheckbox: {
		type: Boolean,
		default: false,
	},
	fetchedData: {
		type: Object,
		default: {},
	}
});

const filterName = props.filterName ? props.filterName : setFilterName([ props.entity ]);

const defaultRange = [0, 100];

const form = ref({
	byFirstDate: {
		name: 'По первой дате',
		value: true,
		type: 'checkbox',
		validateRules: null,
		classes: ['w-full', 'mt-[5px]'],
	},
	rangeData: [...defaultRange],
});

let disableSendData = false;
let formForEdit = null;

const setDefaultData = (disableSend = false) => {
	if (filtersStore.filters?.[filterName]) {
		const rawForm = toRaw(form.value);
		formForEdit = structuredClone(rawForm);

		formForEdit.byFirstDate.value = typeof filtersStore.filters[filterName]?.by_first_date === 'boolean' ? filtersStore.filters[filterName].by_first_date : true;
		formForEdit.rangeData[0] = filtersStore.filters[filterName]?.date_min ? filtersStore.filters[filterName].date_min : (props.fetchedData?.minMaxData?.min ? props.fetchedData?.minMaxData?.min : defaultRange[0]);
		formForEdit.rangeData[1] = filtersStore.filters[filterName]?.date_max ? filtersStore.filters[filterName].date_max : (props.fetchedData?.minMaxData?.max ? props.fetchedData?.minMaxData?.max : defaultRange[1]);

		if (JSON.stringify(form.value) !== JSON.stringify(formForEdit)) {
			disableSendData = disableSend;
			form.value = structuredClone(formForEdit);
		}
	}
}

setDefaultData();

watch(() => filtersStore.filters?.[filterName], () => {
	setDefaultData(true);
}, { deep: true });

watch(form, () => {
	if (disableSendData) {
		disableSendData = false;
		return false;
	}

	if (JSON.stringify(form.value) !== JSON.stringify(formForEdit)) {
		sendData();
	}
}, { deep: true });

const sendData = () => {
	const filtersData = {};
	const date = [...form.value.rangeData];

	const query = {
		...route.query,
	};

	/* Фильтрация по дате */
	if (date && date[0] !== props.fetchedData?.minMaxData?.min) {
		filtersData.date_min = date[0];
		query['date_min'] = filtersData.date_min;
	} else {
		filtersData.date_min = null;
		delete query['date_min'];
	}

	if (date && date[1] !== props.fetchedData?.minMaxData?.max) {
		filtersData.date_max = date[1];
		query['date_max'] = filtersData.date_max;
	} else {
		filtersData.date_max = null;
		delete query['date_max'];
	}

	if (form.value.byFirstDate.value) {
		filtersData.by_first_date = form.value.byFirstDate.value;
		query['by_first_date'] = filtersData.by_first_date;
	} else {
		delete query['by_first_date'];
	}

	if (props.setQueryParams) {
		router.push({
			name: route.name,
			query,
		});
	}

	setFilter(filtersData, filterName);
}
</script>

<template>
	<div class="element mt-[3rem]">
		<MinMaxRange
				v-model="form.rangeData"
				:min="fetchedData.minMaxData.min"
				:max="fetchedData.minMaxData.max"
				:inputForValue="true"
		/>
		<FormGenerator
				v-if="showByFirstDateCheckbox && form.byFirstDate"
				name="by_first_date"
				:element="form.byFirstDate"
				:showTitle="false"
				:clearButton="true"
				validateErrorPosition="bottom"
				labelClasses="w-full block mt-[1rem] cursor-pointer"
				:fieldClasses="form.byFirstDate.classes"
		/>
	</div>
</template>
