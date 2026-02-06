<script setup>
import { inject } from "vue";

const layoutMethods = inject('layoutMethods');

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<img
			:src="item.src"
			:alt="item.description"
			class="cursor-pointer"
			@click="layoutMethods.setOpenedImage(item)"
	>
</template>
