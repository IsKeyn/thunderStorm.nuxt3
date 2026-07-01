<script setup>
import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	data: {
		type: Object,
		default: {},
	},
	pathToDetail: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		default: '',
	}
});
</script>

<template>
	<div class="entertainment-card">
		<div class="image">
			<img :src="data?.covers?.[0]?.src ? data.covers[0].src : '/images/silent-hill/sh_no_image_cover.webp'">
			<div class="info-box">
				<router-link
						v-if="data.slug"
						:target="target"
						class="full-block"
						:to="`/${pathToDetail}/${data.slug}`"
				/>
				<div>
					<span class="name">{{ data.name }}</span>
					<span class="description">{{ data.description }}</span>
				</div>
			</div>
		</div>
		<div class="description-block">
			<span class="title">{{ data.name }}</span>
			<span class="description">{{ data?.release_dates?.[0]?.date ? getFormattedDate('Y', data.release_dates[0].date) : '' }} {{ data?.genres?.[0]?.name ? data.genres[0].name : '' }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.entertainment-card {
	@apply col-span-6 md:col-span-2 relative;

	.image {
		@apply h-[20rem] flex items-center justify-center relative mb-4;

		transition-duration: .4s;

		&:hover {
			transform: scale(1.04) translateY(0);
		}

		img {
			@apply max-h-full;
		}

		.info-box {
			@apply
				absolute bottom-0 left-0
				w-full h-full
				hidden
				p-[1rem] cursor-pointer
				items-center
				text-[var(--main-text-color)]
				bg-black/70
			;

			a.full-block {
				@apply absolute w-full h-full;
			}

			span {
				@apply block;

				&.name {
					@apply text-center text-[1.1rem];
				}

				&.description {
					@apply pt-[0.5rem] overflow-hidden text-center;

					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;

					line-height: 1.3em;
					height: calc(3.9em + 0.5rem);
				}
			}
		}
	}

	.description-block {
		.title {
			@apply
				text-[0.8rem]
				text-[color:var(--main-color)]
				leading-[18px]
				font-normal overflow-hidden text-ellipsis line-clamp-1
			;
		}

		.description {
			@apply text-[0.8rem] text-[color:var(--main-text-color)];
		}
	}

	&:hover {
		.info-box {
			@apply flex;
		}
	}
}

.street-light-theme {
	.image {
		.info-box {
			@apply bg-black/60 text-[var(--main-dark-text-color)];
		}
	}
}
</style>
