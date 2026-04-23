<script setup>
import SelectWithSearch from '@/components/forms/fragments/SelectWithSearch.vue';

import { computed, ref, watch } from "vue";

const emit = defineEmits(['update:modelValue']);

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	modelValue: null,
	apiUrl: {
		required: true,
		default: '',
	},
	body: {
		type: Object,
		default: {},
	},
});

const items = ref({
	options: [],
	value: null,
});

const requestName = 'getItemList_' + props.apiUrl;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.apiUrl) {
				const response = await Promise.resolve(
						sendApiRequest(props.apiUrl, 'GET', props.body, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

watch(requestData, (newData) => {
	items.value.options = [];

	if (newData) {
		const data = newData.data ? newData.data : newData;

		if (typeof data === 'object') {
			items.value.options.push({
				name: 'Не выбрано',
				value: null,
			});

			data.forEach((item) => {
				const value = item.id ? item.id : item.value;

				items.value.options.push({
					name: item.name ? item.name : value,
					value,
				});
			});
		}
	}
}, { immediate: true });

items.value.value = props.modelValue;

watch(() => props.modelValue, (newValue) => {
	items.value.value = newValue;
});

watch(() => items.value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });

let oldBody = props.body;

watch(() => props.body, () => {
	if (Object.keys(props.body).length && JSON.stringify(oldBody) !== JSON.stringify(props.body)) {
		oldBody = props.body;
		refresh();
	}
}, { deep: true });
</script>

<template>
	<SelectWithSearch
			class="mt-2"
			:options="items.options"
			v-model="items.value"
	/>
</template>
