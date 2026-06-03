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
		placeholder: 'Дата анонса',
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
			name="Дата анонса"
			:repeaterItem="repeaterItem"
			:params="params"
			:additionalData="additionalData"
			:defaultValues="defaultValues"
			:onlyValue="true"
			fieldClasses="col-span-3"
	/>
</template>
