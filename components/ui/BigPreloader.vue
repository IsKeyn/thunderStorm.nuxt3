<script setup>
import Preloader from '@/components/ui/Preloader.vue';

const props = defineProps({
	description: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<div class="preloader-container">
		<preloader />
		<span
				v-if="description"
				class="item-box"
		>
			{{ description }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.preloader-container {
	@apply flex justify-center items-center min-h-[10rem] text-[5rem] text-[var(--main-title-color)] flex-col;

	.item-box {
		@apply text-[1rem] mt-4 max-w-[500px];
	}
}
</style>
