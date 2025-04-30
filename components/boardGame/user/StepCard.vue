<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const emit = defineEmits(['setOpenedImage', 'deleteItem', 'useItem']);

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
	prevStep: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<div class="item-box">
		<div class="info">
			<span class="description">
				{{ getFormattedDate('d.m.Y H:i', element.created_at) }} : Шаг №{{ element.id }}.
				<template v-if="Object.keys(prevStep).length > 0">
					Перешел с {{ prevStep.position }} на клетку {{ element.position }}
				</template>
				<template>
					Перешел на клетку {{ element.position }}
				</template>
			</span>
		</div>
		<div v-if="showControlPanel">
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
</template>

<style lang="scss" scoped>

.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex;

	&:hover {
		@apply bg-[var(--second-active-color)];
	}

	img {
		@apply w-[70px] h-[70px] object-cover;
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)];

		.name {
			@apply block mb-1;
		}

		.description {
			@apply block;
		}
	}

	.use-button {
		@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem];
	}

	.close-button {
		@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
	}
}
</style>
