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
				:style="`width: ${currentPercent <= 100 ? currentPercent : 100}%`"
		/>
		<span class="percent">{{ currentPercent }}%</span>
	</div>
</template>

<style lang="scss" scoped>
.bar {
	@apply w-full bg-[var(--main-hover-color)] h-[1.5rem] relative;

	.progress {
		@apply bg-[var(--main-href-color)] h-full absolute top-0 left-0;
	}

	.percent {
		@apply absolute z-[1];
	}
}
</style>
