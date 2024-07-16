<script setup>
const props = defineProps({
	modelValue: {
		type: Array,
		default: {},
	},
	editMode: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<input v-if="editMode" v-model="modelValue">
	<template v-else-if="modelValue">
		{{ modelValue }}
	</template>
</template>
