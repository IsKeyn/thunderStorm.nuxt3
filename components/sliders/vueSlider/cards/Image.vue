<script setup>
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
			:media-id="item.id"
			:alt="item.description"
			class="media-obj"
	>
</template>
