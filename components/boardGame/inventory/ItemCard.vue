<script setup>
const emit = defineEmits(['setOpenedImage', 'deleteItem', 'useItem']);

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	cutDescription: {
		type: Boolean,
		default: false,
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div :class="['item-box', showControlPanel || element.quantity > 1 ? 'add-padding-right' : '']">
		<img
				v-if="element.image"
				:src="getResizeImg(element.image)"
				:alt="element.name"
				:title="element.name"
				@click="useLightBox ? emit('setOpenedImage', element.image) : false"
		>
		<div class="info">
			<span class="name">
				{{ element.name }}
			</span>
			<span
					:class="[
							'description',
							cutDescription ? 'cut-description' : '',
					]"
			>
				{{ element.description }}
			</span>
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
		<div
				v-if="element.quantity > 1"
				class="count-panel"
		>
			x{{ element.quantity }}
		</div>
	</div>
</template>

<style lang="scss" scoped>

.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex relative cursor-pointer min-h-[86px];

	&.add-padding-right {
		@apply pr-[3rem];
	}

	&:hover {
		@apply bg-[var(--second-active-color)];
	}

	img {
		@apply w-[70px] h-[70px];
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)];

		.name {
			@apply block mb-1 uppercase;
		}

		.description {
			@apply block;

			&.cut-description {
				@apply w-[15ch];

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
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

	.count-panel {
		@apply absolute right-0 top-0 flex justify-between items-center text-[1.5rem] h-full p-[1rem];
	}
}
</style>
