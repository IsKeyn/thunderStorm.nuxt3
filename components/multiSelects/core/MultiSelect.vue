<script setup>
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
});

const selected = ref([]);

const init = () => {
	selected.value = selected.value.concat(props.modelValue);
}

const addElement = (event) => {
	// TODO возможно стоит определяет промис или нет и если промис, то переводить в объект toRaw
	selected.value.push(toRaw(event));
}

const deleteElement = (key) => {
	// TODO возможно стоит определяет промис или нет и если промис, то переводить в объект toRaw
	selected.value = selected.value.filter((item, inx) => {
		if (key !== inx) {
			return item;
		}
	});
}

init();

defineExpose({
	addElement,
	deleteElement,
});

watch(() => selected.value, () => {
	emit('update:modelValue', selected.value);
}, { deep: true });
</script>

<template>
	<slot
			:selected="selected"
	/>
</template>
