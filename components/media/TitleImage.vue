<script setup>
import LightBox from '@/components/media/LightBox.vue'

import { lightBox } from '@/composables/lightBox.js';
const { openedImage, setOpenedImage } = lightBox();


const props = defineProps({
	image: {
		type: Object,
		default: {},
		required: true,
	},
});
</script>

<template>
	<div
			v-if="Object.keys(image).length > 0"
			class="image-box"
			@click="setOpenedImage(image)"
	>
		<img
				class="article-image"
				:src="image.src"
				:alt="image.name"
				:name="image.name"
		/>
	</div>
	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.image-box {
	@apply
		flex justify-center items-center
		h-[350px]
		truncate
		mt-[30px] mb-[30px]
		cursor-pointer
	;

	.article-image {
		@apply min-h-[350px] max-w-full h-auto;
	}
}
</style>
