<script setup>
const props = defineProps({
	classes: {
		type: String,
		default: 'z-[999]',
	},
});
</script>

<template>
	<div :class="`fixed inset-0 bg-black/50 ${classes}`" />
</template>
