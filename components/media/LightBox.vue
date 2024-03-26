<script setup>
import Overlay from '@/components/layout/Overlay.vue';

const props = defineProps({
	image: {
		type: String,
		default: '',
	}
});

const emit = defineEmits(['hideLightBox']);
</script>

<template>
	<div class="light-box" style="">
		<img
				class="background-img"
				:src="image.src"
		>
<!--		<Overlay />-->
		<div class="wrapper">
			<font-awesome-icon
					:icon="['fas', 'xmark']"
					class="icon close-button"
					@click="$emit('hideLightBox')"
			/>
			<img :src="image.src">
		</div>
	</div>
</template>

<style lang="scss" scoped>
.light-box {
	@apply fixed left-0 top-0 z-[700] w-full h-full;
	color: var(--second-text-color);

	.background-img {
		@apply absolute top-0 left-0 w-full h-full object-cover scale-[1.2] z-0;
		filter: blur(24px);
	}

	.wrapper {
		@apply
			relative
			h-full
			mt-0 mr-auto ml-auto
			overflow-auto
		;

		.close-button {
			position: absolute;
			font-size: 40px;
			top: 20px;
			right: 10px;
			cursor: pointer;
			z-index: 700;
			background: aquamarine;
		}

		img {
			@apply h-full w-full max-h-[100vw] object-contain mb-0 relative;
		}
	}
}
</style>
