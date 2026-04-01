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

const repeaterItem = {
	date: {
		name: 'date',
		type: 'date',
		value: '',
		placeholder: 'Дата выхода',
	},
	gaming_platform: {
		name: 'gaming_platform',
		type: 'select-with-search',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
		],
		value: null,
		placeholder: 'Платформа',
	},
	addInfo: {
		name: 'addInfo',
		type: 'text',
		value: '',
		placeholder: 'Дополнительная информация',
	},
	hideDay: {
		name: 'hideDay',
		title: 'Скрыть день',
		type: 'checkbox',
		value: false,
	},
	hideMonth: {
		name: 'hideMonth',
		title: 'Скрыть месяц',
		type: 'checkbox',
		value: false,
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
			name="Дата выхода в связке с платформой"
			:repeaterItem="repeaterItem"
			:params="params"
			:additionalData="additionalData"
			:defaultValues="defaultValues"
			fieldClasses="col-span-2"
	/>
</template>

