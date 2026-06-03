<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
});

const form = ref({
	title: {
		name: 'Title',
		type: 'text',
		value: '',
		placeholder: '',
		classes: ['w-full', 'mt-[5px]'],
	},
	description: {
		name: 'Описание',
		type: 'textarea',
		value: '',
		placeholder: '',
		classes: ['w-full', 'mt-[5px]'],
	},
	keywords: {
		name: 'Ключевые слова',
		type: 'textarea',
		value: '',
		placeholder: '',
		classes: ['w-full', 'mt-[5px]'],
	},
});

const updateItems = (value) => {
	for (let key in form.value) {
		form.value[key].value = value[key];
	}
}

updateItems(toRaw(props.modelValue));

// Устанавливаем новые значения, при изменении в форме
watch(form.value, () => {
	setVmodel();
}, { deep: true });

const setVmodel = () => {
	const resultData = {};

	for (let key in form.value) {
		resultData[key] = form.value[key].value;
	}

	emit('update:modelValue', resultData);
}
</script>

<template>
	<div>
		<FormGenerator
				v-for="(field, index) in form"
				:key="index"
				:name="index"
				:element="field"
				:form="form"
				:showValidateError=true
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]']"
				:fieldClasses="field.classes"
		/>
	</div>
</template>
