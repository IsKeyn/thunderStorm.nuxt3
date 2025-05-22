<script setup>
import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	game: {
		type: Object,
		default: {},
	},
	target: {
		type: String,
		default: '',
	}
});
</script>

<template>
	<div class="game-card">
		<div class="image">
			<img v-if="game?.covers[0]?.src" :src="game?.covers[0]?.src">
			<div class="info-box">
				<router-link
						:target="target"
						v-if="game.slug"
						class="full-block"
						:to="`/${entity}/${game.slug}`"
				/>
				<div>
					<span class="name">{{ game.name }}</span>
					<span class="description">{{ game.description }}</span>
				</div>
			</div>
		</div>
		<div class="description-block">
			<span class="title">{{ game.name }}</span>
			<span class="description">{{ game?.release_dates[0]?.date ? getFormattedDate('Y', game.release_dates[0].date) : '' }} {{ game?.genres[0]?.name ? game.genres[0].name : '' }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.game-card {
	@apply col-span-6 md:col-span-2 relative;

	.description-block {
		.title {
			@apply text-[0.8rem];

			line-height: 18px;
			color: var(--main-color);
			font-weight: 400;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			line-clamp: 1;
			-webkit-box-orient: vertical;
		}

		.description {
			@apply text-[0.8rem];

			color: var(--main-dark-text-color);
		}
	}

	&:hover {
		.info-box {
			@apply flex;
		}
	}

	.image {
		@apply h-[20rem] flex items-center relative;

		margin-bottom: 1rem;
		transition-duration: .4s;

		&:hover {
			transform: scale(1.04) translateY(0);
		}
	}

	.info-box {
		@apply
		absolute bottom-[0] left-[0]
		w-full h-full
		hidden
		p-[1rem] cursor-pointer
		items-center
		;

		background: rgba(0, 0, 0, 0.7);

		a.full-block {
			@apply absolute w-full h-full;
		}

		span {
			@apply block;

			&.name {
				@apply text-center;

				font-size: 1.1rem;
			}

			&.description {
				@apply
				pt-[0.5rem]
				overflow-hidden
				text-center
				;

				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;

				line-height: 1.3em;
				height: calc(3.9em + 0.5rem);
			}
		}
	}
}
</style>
