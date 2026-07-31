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
	id: {
		name: 'id',
		value: '',
		type: 'hidden',
		validateRules: null,
		classes: ['w-full', 'mt-[5px]'],
	},
	code: {
		name: 'code',
		title: 'code',
		type: 'text',
		value: null,
		placeholder: 'code',
	},
	name: {
		name: 'name',
		title: 'Название',
		type: 'text',
		value: null,
		placeholder: 'Название',
	},
	site_id: {
		name: 'site_id',
		title: 'ID сайта',
		type: 'number',
		value: 1,
		placeholder: 'ID сайта',
	},
	value: {
		name: 'value',
		title: 'Значение',
		type: 'text',
		value: null,
		placeholder: 'Значение',
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
			name="Настройка настольной игры"
			:repeaterItem="repeaterItem"
			:params="params"
			:additionalData="additionalData"
			:defaultValues="defaultValues"
			fieldClasses="col-span-2"
			:onlyValue="true"
	/>
</template>
