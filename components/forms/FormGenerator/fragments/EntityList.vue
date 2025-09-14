<script setup>
import SelectWithSearch from '@/components/forms/fragments/SelectWithSearch.vue';

import { computed, ref, watch } from "vue";

const emit = defineEmits(['update:modelValue']);

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
	hasResource: {
		type: Boolean,
		default: true,
	},
});

const items = ref({
	options: [],
	value: null,
});

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const route = useRoute();
const requestName = 'getItemList_' + props.apiUrl;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(props.apiUrl, 'GET', props.body, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

watch(requestData, (newData) => {
	items.value.options = [];

	if (newData) {
		const data = props.hasResource ? newData.data : newData;

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

const fetchedData = computed(() => requestData.value || null);
items.value.value = props.modelValue;

watch(() => props.modelValue, (newValue) => {
	items.value.value = newValue;
});

watch(() => items.value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });

watch(() => props.body, () => {
	refresh();
}, { deep: true });
</script>

<template>
	<SelectWithSearch
			class="mt-2"
			:options="items.options"
			v-model="items.value"
	/>
</template>
