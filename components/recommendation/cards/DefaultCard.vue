<script setup>
import { helper } from '@/composables/helper.js'
const { cutText } = helper();

const props = defineProps({
	data: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<div class="entertainment-card">
		<div class="image">
			<img :src="data?.media[0]?.src ? data?.media[0]?.src : '/images/silent-hill/sh_no_image_cover.webp'">
			<div class="info-box">
				<router-link
						v-if="data.url"
						class="full-block"
						:to="data.url"
				/>
				<div>
					<span class="name">{{ data.name }}</span>
					<span class="description">{{ data.description }}</span>
				</div>
			</div>
		</div>
		<div class="description-block">
			<span class="title">{{ data.name }}</span>
			<span class="description">
				{{ data?.description ? cutText(data.description, 25) : '' }}
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.entertainment-card {
	@apply relative w-full;

	.image {
		@apply h-[20rem] flex items-center justify-center relative mb-4 overflow-hidden;

		img {
			@apply w-full h-full object-cover transition-transform;

			transition-duration: .4s;
		}

		&:hover {
			img {
				transform: scale(1.04);
			}
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
				z-10
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
			@apply text-[0.8rem] text-[color:var(--main-text-color)] block min-h-[1rem];
		}
	}

	&:hover {
		.info-box {
			@apply flex;
		}
	}
}
</style>
