<script setup>
const props = defineProps({
	theme: { // percent, on-from-current
		type: String,
		default: 'percent',
	},
	fullFill: {
		type: Number,
		default: 100,
	},
	currentFill: {
		type: Number,
		default: 10,
	},
});
</script>

<template>
	<div class="bar">
		<div
				class="progress"
				:style="`width: ${currentFill <= fullFill ? 100 / (fullFill / currentFill) : 100}%`"
		/>
		<span
				v-if="theme === 'percent'"
				class="percent"
		>{{ currentFill }}%</span>
		<span
				v-if="theme === 'on-from-current'"
				class="percent"
		>{{ currentFill }} из {{ fullFill }}</span>
	</div>
</template>

<style lang="scss" scoped>
.bar {
	@apply w-full bg-[var(--main-hover-color)] h-[1.5rem] relative;

	.progress {
		@apply bg-[var(--main-href-color)] h-full absolute top-0 left-0;
	}

	.percent {
		@apply absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[1];
	}
}
</style>
