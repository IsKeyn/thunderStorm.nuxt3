<script setup>
const props = defineProps({
	errors: {
		type: Array,
		required: true,
	},
});
</script>

<template>
	<div class="wrapper">
		<div
				v-for="(error, key) in errors"
				:key="key"
				class="error-line"
		>
			<font-awesome-icon icon="fa-solid fa-circle-exclamation" /> {{ error }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply mt-2 mb-2;

	.error-line {
		@apply text-[var(--error-color)] mb-1;
	}
}
</style>
