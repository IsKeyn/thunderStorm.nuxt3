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
	simpleImage: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div>
		<img
				v-if="simpleImage && Object.keys(image).length > 0"
				class="simple-article-image"
				:src="image.src"
				:alt="image.name"
				:name="image.name"
		/>
		<div v-else class="parent-box">
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
			<div class="empty-square" />
		</div>

		<LightBox
				v-if="openedImage"
				:image="openedImage"
				:setViewsLog="true"
				@setCurrentElement="setOpenedImage"
		/>
	</div>
</template>

<style lang="scss" scoped>
.simple-article-image {
	@apply md:w-[12rem] md:h-[12rem];
}

.parent-box {
	@apply
		relative
		md:w-[250px] md:h-[250px]
	;

	&:hover {
		.image-box {
			top: 40px;
			left: 40px;
			transition: 1.5s;
		}
	}

	.image-box {
		@apply
			md:absolute top-0 left-0 z-[2]
			flex justify-center items-center
			max-h-[16rem]
			md:h-[190px]
			md:w-[190px]
			truncate
			cursor-pointer
		;

		transition: 1.5s;

		.article-image {
			@apply
				h-full
				w-auto
				max-w-none
			;
		}
	}

	.empty-square {
		@apply
			hidden md:block
			absolute bottom-0 right-0 z-[1]
			md:h-[190px]
			md:w-[190px]
		;

		border: 20px solid var( --second-hover-color);
	}
}
</style>
