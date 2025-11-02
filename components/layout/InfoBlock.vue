<script setup>
const props = defineProps({
	text: {
		type: String,
		required: true,
	},
	classes: {
		type: String,
		default: '',
	}
});
</script>

<template>
	<div :class="['info-block', classes]">
		<font-awesome-icon :icon="['fas', 'circle-info']" />
		<span>{{ text }}</span>
	</div>
</template>

<style lang="scss" scoped>
.info-block {
	@apply p-4 mb-2 bg-[var(--second-bg-color)] flex relative items-center text-[var(--main-dark-text-color)];

	&.error {
		@apply bg-[var(--alert-color)] mb-0 mt-2;
	}

	svg {
		@apply text-[1.5rem] mr-[1rem];
	}
}
</style>
