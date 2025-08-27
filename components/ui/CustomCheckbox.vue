<script setup>
import { computed } from 'vue';

const props = defineProps({
	modelValue: Boolean,
	label: String,
	disabled: Boolean,
	invalid: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);

const internalValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value)
});

const handleChange = (event) => {
	emit('change', event.target.checked);
};
</script>

<template>
	<label
			class="custom-checkbox"
			:class="{
      'custom-checkbox--disabled': disabled,
      'custom-checkbox--invalid': invalid
    }"
	>
		<input
				type="checkbox"
				v-model="internalValue"
				:disabled="disabled"
				@change="handleChange"
				class="custom-checkbox__input"
		>
		<span class="custom-checkbox__checkmark"></span>
		<span class="custom-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
	</label>
</template>

<style scoped>
.custom-checkbox {
	display: inline-flex;
	align-items: center;
	position: relative;
	cursor: pointer;
	user-select: none;
	gap: 8px;
}

.custom-checkbox__input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

.custom-checkbox__checkmark {
	display: inline-block;
	width: 18px;
	height: 18px;
	border: 2px solid #ccc;
	border-radius: 4px;
	transition: all 0.2s;
	position: relative;
}

.custom-checkbox__input:checked ~ .custom-checkbox__checkmark {
	background-color: #42b983;
	border-color: #42b983;
}

.custom-checkbox__checkmark:after {
	content: "";
	position: absolute;
	display: none;
	left: 5px;
	top: 1px;
	width: 5px;
	height: 10px;
	border: solid white;
	border-width: 0 2px 2px 0;
	transform: rotate(45deg);
}

.custom-checkbox__input:checked ~ .custom-checkbox__checkmark:after {
	display: block;
}

.custom-checkbox__label {
	margin-left: 4px;
}

.custom-checkbox--disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.custom-checkbox--invalid .custom-checkbox__checkmark {
	border-color: #ff4444;
}

.custom-checkbox--invalid .custom-checkbox__input:checked ~ .custom-checkbox__checkmark {
	border-color: #ff4444;
}
</style>
