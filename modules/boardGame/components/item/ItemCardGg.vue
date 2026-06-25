<script setup>
import { media } from '@/composables/media.js'
const { getResizeImg } = media();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: '',
	},
	cutDescription: {
		type: Boolean,
		default: false,
	},
	theme: {
		type: String,
		default: 'default',
	},
	showDropChance: {
		type: Boolean,
		default: true,
	},
});
</script>

<template>
	<div :class="['item-box', theme, classes]">
		<div class="wrapper">
			<img
					v-if="element.item.image"
					:src="getResizeImg(element.item.image)"
					:alt="element.item.name"
					:title="element.item.name"
			>
			<div class="info">
				<span class="name">{{ element.item.name }}</span>
				<span
						:class="[
								'description',
								cutDescription ? 'cut-description' : '',
						]"
				>
					{{ element.item.short_description ? element.item.short_description : element.item.full_description }}
				</span>
				<span v-if="showDropChance" class="additional-box">
						Относительный шанс выпадения: {{ element.item.drop_chance }}%
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply bg-[var(--second-bg-color)] rounded-none relative p-2 mb-2 ;

	&.gamblingGame {
		@apply w-full;
	}

	&.default {
		&.red {
			border-left: 8px solid #600000;
		}

		&.green {
			border-left: 8px solid #005d00;
		}

		&.blue {
			border-left: 8px solid #000460;
		}
	}

	&.active {
		@apply bg-[var(--second-active-color)];
	}

	.wrapper {
		@apply z-0 flex;

		img {
			@apply w-[70px] h-[70px];
		}

		.info {
			@apply pl-3 pr-3 text-[var(--main-text-color)];

			.description {
				@apply block;

				&.cut-description {
					@apply w-[30ch] md:w-[55ch] lg:w-[75ch] 2xl:w-[100ch] fhd:w-[130ch];

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.additional-box {
				@apply block mt-2;
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.street-light-theme {
	.item-box {
		.info {
			@apply text-[var(--main-dark-text-color)];
		}
	}
}
</style>
