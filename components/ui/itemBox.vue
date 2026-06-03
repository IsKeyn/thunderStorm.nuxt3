<script setup>
const props = defineProps({
	message: {
		type: String,
		default: 'По данному запросу не ничего не найдено',
	},
	classes: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<div
			v-if="message"
			:class="['item-box', classes]"
			v-html="message"
	/>
</template>

<style lang="scss" scoped>
	.item-box {
		@apply
			mb-2 mt-2
			p-2
			bg-[var(--second-bg-color)]
		;

		&.red {
			@apply border-l-[0.4rem] border-[var(--error-color)];
		}

		&.green {
			@apply border-l-[0.4rem] border-[var(--success-color)];
		}
	}
</style>
