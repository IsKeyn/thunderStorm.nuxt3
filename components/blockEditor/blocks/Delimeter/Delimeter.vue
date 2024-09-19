<script setup>
const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	previewMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<hr/>
</template>

<style lang="scss" scoped>
hr {
	@apply border-[1px] border-[var(--second-border-color)];
}
</style>
