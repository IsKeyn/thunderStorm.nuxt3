<script setup>
import Overlay from "@/components/layout/Overlay.vue";

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: '',
	},
	overlayClasses: {
		type: String,
		default: '',
	},
	itemHeight: {
		type: Number,
		default: 100,
	},
});
</script>

<template>
	<div
			:class="['item-box', classes]"
			:style="`background-image: url('${getResizeImg(element.game.title_image, 1500)}');`"
	>
		<div :class="['card-overlay', classes, overlayClasses]" />
		<div class="content-box" :style="`height: ${itemHeight}px`">
			<div class="info">
				<span class="name">
					{{ element.game.name }} <span v-if="element.platform">({{ element.platform.short_name ?? element.platform.name }})</span>
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex relative w-full h-full;

	background-size: cover; /* Масштабирует изображение, чтобы оно заполнило блок */
	background-repeat: no-repeat; /* Отключает повторение */
	background-position: center; /* Центрирует изображение */

	.card-overlay {
		@apply absolute top-0 left-0 inset-0 bg-black/40;
	}

	.content-box {
		@apply absolute top-0 left-0 z-[1] w-full flex items-center justify-center;
	}

	&.active {
		@apply bg-[var(--second-active-color)];

		animation: pulseScale 1.3s infinite ease-in-out;

		.card-overlay {
			@apply bg-black/30;
		}
	}

	@keyframes pulseScale {
		0% { background-size: 100%; }
		50% { background-size: 110%; }
		100% { background-size: 100%; }
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-dark-text-color)] text-center;

		.name {
			@apply block mb-1 uppercase;

			text-shadow: 0 2px 4px rgba(0,0,0,0.10);
		}
	}
}
</style>
