<script setup>
const props = defineProps({
	currentPercent: {
		type: Number,
		default: 10,
	},
});
</script>

<template>
	<div class="bar">
		<div
				class="progress"
				:style="`width: ${currentPercent}%`"
		/>
	</div>
</template>

<style lang="scss" scoped>
.bar {
	@apply w-full bg-[var(--main-hover-color)] h-4 relative;

	.progress {
		@apply bg-[var(--main-href-color)] h-4 absolute top-0 left-0;
	}
}
</style>
