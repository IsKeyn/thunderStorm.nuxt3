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
});

const items = ref({
	options: [],
	value: null,
});

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const route = useRoute();
const requestName = 'getItemList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(props.apiUrl, 'GET', {}, requestName, '')
			);

			if (response) {
				response.data.forEach((item) => {
					items.value.options.push({
						name: item.name,
						value: item.id,
					});
				});
			}

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

watch(() => props.modelValue, (newValue) => {
	items.value.value = newValue;
});

watch(() => items.value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });
</script>

<template>
	<SelectWithSearch
			class="mt-2"
			:options="items.options"
			v-model="items.value"
	/>
</template>
