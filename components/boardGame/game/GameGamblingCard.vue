<script setup>
import Overlay from "@/components/layout/Overlay.vue";

const emit = defineEmits(['setOpenedImage', 'deleteItem', 'useItem']);

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	classes: {
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
		<div :class="`card-overlay ${classes}`" />
		<div class="content-box" :style="`height: ${itemHeight}px`">
<!--			<img-->
<!--					v-if="element.image"-->
<!--					:src="getResizeImg(element.image, 1500)"-->
<!--					:alt="element.name"-->
<!--					:title="element.name"-->
<!--					@click="emit('setOpenedImage', element.image)"-->
<!--			>-->
			<div class="info">
				<span class="name">
					{{ element.game.name }} <span v-if="element.platform">({{ element.platform.name }})</span> <!--<span  v-if="element.game?.release_dates[0]?.date">({{ getFormattedDate('Y', element.game.release_dates[0].date) }})</span>-->
				</span>
				<span v-if="element.points !== null && element.points !== undefined" class="description">
					Очки за игру: {{ element.points }}
				</span>

<!--				<span class="description">-->
<!--					{{ element.game.description }}-->
<!--				</span>-->
			</div>
			<div
					v-if="showControlPanel"
					class="control-panel"
			>
				<span
						class="use-button"
						@click="emit('useItem', element)"
				>
					<font-awesome-icon :icon="['fas', 'check']" />
				</span>
				<span
						class="close-button"
						@click="emit('deleteItem', element)"
				>
					<font-awesome-icon :icon="['fas', 'xmark']" />
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
		@apply absolute top-0 left-0 inset-0 bg-black/70;
	}

	.content-box {
		@apply absolute top-0 left-0 z-[1] w-full flex items-center justify-center;
	}

	&.active {
		@apply bg-[var(--second-active-color)];

		.card-overlay {
			@apply bg-black/40;
		}
	}

	img {
		@apply w-[70px] h-[70px];
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)] text-center;

		.name {
			@apply block mb-1 uppercase;
		}

		.description {
			@apply block;

			width: 110ch; /* примерно 30 символов */
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.control-panel {
		@apply absolute right-[1rem];

		.use-button {
			@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem];
		}

		.close-button {
			@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
		}
	}
}
</style>
