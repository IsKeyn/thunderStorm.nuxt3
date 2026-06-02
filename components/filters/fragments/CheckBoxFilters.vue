<script setup>
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
	usedFilters: {
		type: Array,
		default: [],
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
});

const filterName = props.filterName ? props.filterName : setFilterName([ props.entity ]);

const filtersModel = ref({});

let disableSendData = false;
let formForEdit = null;

const setDefaultData = (disableSend = false) => {
	const rawForm = toRaw(filtersModel.value);
	formForEdit = structuredClone(rawForm);

	if (props.usedFilters.length > 0) {
		props.usedFilters.forEach((item) => {
			let value = item?.defaultValue ?? false;

			if (filtersStore.filters[filterName] && filtersStore.filters[filterName][item.name]) {
				value = filtersStore.filters[filterName][item.name];
			}

			if (item.name) {
				formForEdit[item.name] = {
					name: item?.langName ?? 'Чекбокс',
					value: value,
					type: item?.type,
				};
			}
		});
	}

	if (JSON.stringify(filtersModel.value) !== JSON.stringify(formForEdit)) {
		disableSendData = disableSend;
		filtersModel.value = structuredClone(formForEdit);
	}
}

setDefaultData();

watch(() => filtersStore.filters?.[filterName], () => {
	setDefaultData(true);
}, { deep: true });

watch(filtersModel, () => {
	if (disableSendData) {
		disableSendData = false;
		return false;
	}

	if (JSON.stringify(filtersModel.value) !== JSON.stringify(formForEdit)) {
		sendData();
	}
}, { deep: true });

const sendData = () => {
	const filtersData = {};

	const query = {
		...route.query,
	};

	props.usedFilters.forEach((item) => {
		if (filtersModel.value[item.name]) {
			filtersData[item.name] = filtersModel.value[item.name].value;

			if (filtersModel.value[item.name].value) {
				query[item.name] = filtersData[item.name];
			} else if (query[item.name]) {
				delete query[item.name];
			}
		}
	});

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
	<div class="flex mt-5 mb-5">
		<template v-for="field in filtersModel">
			<FormGenerator
					v-if="field"
					:name="field.name"
					:element="field"
					:form="item"
					:showTitle="false"
					validateErrorPosition="bottom"
					fieldClasses="w-full"
					labelClasses="mr-5"
			/>
		</template>
	</div>
</template>

<style lang="scss" scoped />
