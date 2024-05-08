<script setup>
const props = defineProps({
	structure: {
		type: Object,
		default: null,
	},
});
</script>

<template>
	<div v-if="structure && structure.text">
		<p v-html="structure.text"/>
	</div>
</template>
