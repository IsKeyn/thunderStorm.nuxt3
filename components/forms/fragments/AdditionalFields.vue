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
	id: {
		name: 'id',
		value: '',
		type: 'hidden',
		validateRules: null,
		classes: ['w-full', 'mt-[5px]'],
	},
	name: {
		name: 'Название',
		value: '',
		type: 'text',
		placeholder: 'Название',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
	},
	slug: {
		name: 'Slug',
		value: '',
		type: 'text',
		placeholder: 'slug',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
		autoFill: {
			sourceFieldKey: 'name',
			rule: 'slug',
		},
	},
	value: {
		name: 'Значение',
		value: '',
		type: 'text',
		placeholder: 'Значение',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
	},
	sort: {
		name: 'Сортировка',
		value: '',
		type: 'number',
		placeholder: 'Сортировка',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
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
			name="Дополнительные поля"
			:repeaterItem="repeaterItem"
			:params="params"
			:additionalData="additionalData"
			:defaultValues="defaultValues"
			:onlyValue="true"
			fieldClasses="col-span-2"
	/>
</template>
