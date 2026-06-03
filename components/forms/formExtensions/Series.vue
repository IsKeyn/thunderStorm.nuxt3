<script setup>
import ElementWithRepeater from '@/components/forms/fragments/ElementWithRepeater.vue';

import { ref, watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	params: {
		type: Object,
		default: {},
	},
	/*
	 * Дополнительные данные для построения, например по списку из сущности.
	 * Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC)
	 */
	additionalData: {
		type: Object,
		default: {},
	},
	defaultValues: {
		type: Array,
		default: [],
	},
});

// Один элемент репитора
const repeaterItem = {
	series: {
		name: 'series',
		type: 'select-with-search',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
		],
		value: null,
		placeholder: 'Серия',
	},
};

const value = ref([ ...props.modelValue ]);

watch(() => value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });
</script>

<template>
	<ElementWithRepeater
			v-model="value"
			name="Серия"
			:repeaterItem="repeaterItem"
			:params="params"
			:additionalData="additionalData"
			:defaultValues="defaultValues"
	/>
</template>
