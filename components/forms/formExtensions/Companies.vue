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

const repeaterItem = { // Один элемент репитора
	company: {
		name: 'company',
		type: 'select-with-search',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
		],
		value: null,
		placeholder: 'Наименование компании',
	},
	company_role: {
		name: 'company_role',
		type: 'select-with-search',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
		],
		value: null,
		placeholder: 'Роль компании в разработке',
	},
	additional_info: {
		name: 'additional_info',
		type: 'text',
		value: '',
		placeholder: 'Дополнительная информация',
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
			name="Компании учавствующие в разработке"
			:repeaterItem="repeaterItem"
			:params="params"
			:additionalData="additionalData"
			:defaultValues="defaultValues"
			fieldClasses="col-span-3"
	/>
</template>

