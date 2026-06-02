<script setup>
import Slider from '@vueform/slider';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 100,
	},
	modelValue: {
		type: Object,
		default: () => ([0, 100])
	},
	inputForValue: {
		type: Boolean,
		default: false,
	},
});

const form = ref({
	min: {
		name: 'Наименьшее значение',
		value: props.min,
		type: 'number',
		placeholder: 'Число',
		validateRules: 'minNumber_' + props.min + ', maxNumber_' + props.max,
		classes: 'w-[6rem]',
		min: props.min,
		max: props.max,
	},
	max: {
		name: 'Наибольшее значение',
		value: props.max,
		type: 'number',
		placeholder: 'Число',
		validateRules: 'minNumber_' + props.min + ', maxNumber_' + props.max,
		classes: 'w-[6rem]',
		min: props.min,
		max: props.max,
	},
});

const rangeValue = computed({
	get: () => props.modelValue,
	set: (value) => { emit('update:modelValue', value); }
});

watch(() => props.modelValue, (newValue) => {
	form.value.min.value = newValue[0];
	form.value.max.value = newValue[1];
}, { deep: true, immediate: true });

const handleUpdate = (value) => {
	emit('update:modelValue', value);
}
</script>

<template>
	<div class="mt-[2rem]">
		<Slider
				v-model="rangeValue"
				:min="min"
				:max="max"
				:merge="1"
				:tooltips="true"
				@update="handleUpdate"
		/>
	</div>
	<div
			v-if="inputForValue"
			class="input-fields"
	>
		<FormGenerator
				v-if="form.min"
				name="min"
				:element="form.min"
				:showTitle="false"
				validateErrorPosition="bottom"
				labelClasses=""
				:fieldClasses="form.min.classes"
		/>
		<FormGenerator
				v-if="form.max"
				name="max"
				:element="form.max"
				:showTitle="false"
				validateErrorPosition="bottom"
				labelClasses=""
				:fieldClasses="form.max.classes"
		/>
	</div>
</template>

<style lang="scss">
@import '@vueform/slider/themes/default.css';
</style>

<style lang="scss" scoped>
.input-fields {
	@apply flex justify-between mt-2;
}
</style>
