<script setup>
import Preloader from '@/components/ui/Preloader.vue';

const props = defineProps({
	description: {
		type: String,
		default: null,
	},
	theme: { // default, image
		type: String,
		default: 'default',
	},
	themeType: {
		type: Number,
		default: 1,
	},
});
</script>

<template>
	<div class="preloader-container">
		<preloader v-if="theme === 'default'" class="default" />
		<ui-preloaders-ImagePreloader
				v-else-if="theme === 'image'"
				:imageNumber="themeType"
				animateType="animate-[spin_2s_linear_infinite]"
		/>
		<ui-itemBox
				v-if="description"
				class="max-w-[500px]"
				:message="description"
		/>
	</div>
</template>

<style lang="scss" scoped>
.preloader-container {
	@apply flex justify-center items-center min-h-[10rem] flex-col;

	.default {
		@apply text-[var(--main-title-color)] text-[5rem];
	}
}
</style>
