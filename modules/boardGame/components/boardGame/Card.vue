<script setup>
import { helper } from '@/composables/helper.js'
const { route } = helper();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getStatusName, getDateString } = boardGame();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: '',
	},
	showStatusBar: {
		type: Boolean,
		default: true,
	},
	itemHeight: {
		type: Number,
		default: 100,
	},
});

const getStatusClass = (status) => {
	switch (status) {
		case 0: return 'red';
		case 1: return 'green';
		case 2: return 'blue';
		case 3: return 'violet';
	}
}
</script>

<template>
	<nuxt-link
			:class="['item-box',  getStatusClass(element.status)]"
			:to="`/e/${element.slug}/`"
	>
		<div
				v-if="showStatusBar"
				:class="['status-bar']"
		>
			{{ getStatusName(element) }} {{ getDateString(element) }}
		</div>
		<div
				class="content-box"
				:style="`background-image: url('${getResizeImg(element.media, 1500)}'); height: ${itemHeight}px;`"
		>
			<div :class="`card-overlay ${classes}`" />
			<div class="info">
				<span class="name">{{ element.name }}</span>
				<div class="message">{{ element.description }}</div>
			</div>
		</div>
	</nuxt-link>
</template>

<style lang="scss" scoped>
a {
	&.item-box {
		@apply
			block p-0
			bg-[var(--second-bg-color)] rounded-none w-full mb-2
			text-[var(--main-dark-text-color)]
		;

		&.violet {
			border-left: 8px solid #270062;
		}

		&.red {
			border-left: 8px solid #600000;
		}

		&.green {
			border-left: 8px solid #005d00;
		}

		&.blue {
			border-left: 8px solid #000460;
		}

		.content-box {
			@apply p-2 bg-[var(--second-bg-color)] rounded flex relative w-full h-full;

			background-size: cover; /* Масштабирует изображение, чтобы оно заполнило блок */
			background-repeat: no-repeat; /* Отключает повторение */
			background-position: center; /* Центрирует изображение */

			.card-overlay {
				@apply absolute top-0 left-0 inset-0 bg-black/40;
			}

			.info {
				@apply w-full pl-3 pr-3 text-center z-[1] text-[var(--main-text-color)] flex flex-col items-center justify-center;

				.name {
					@apply block mb-[1rem] uppercase;
				}
			}

			a {
				@apply text-[var(--main-text-color)];
			}
		}

		.status-bar {
			@apply w-full p-2 text-center bg-[var(--button-color-1)];
		}
	}

	&:hover {
		@apply no-underline;
	}
}

.street-light-theme {
	a {
		&.item-box {
			.content-box {
				.info {
					@apply text-[var(--main-dark-text-color)];
				}
			}
		}
	}
}
</style>
