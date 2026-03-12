<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

import { ref } from "vue";

const props = defineProps({
	count: {
		type: Number,
		default: 0,
	},
	useDefaultNavigation: {
		type: Boolean,
		default: false,
	},
});

const carouselConfig = {
	wrapAround: true,
	itemsToShow: 1,
	pauseAutoplayOnHover: true,
	autoplay: 10000,
	mouseWheel: true,
	transition: 750,
}

const carouselRef = ref()

const next = () => carouselRef.value.next();
const prev = () => carouselRef.value.prev();
</script>

<template>
	<div v-if="count > 0">
		<slot v-if="count === 1" name="slot-1" />
		<div v-else class="slider">
			<Carousel
					ref="carouselRef"
					v-bind="carouselConfig"
					class="w-full"
			>
				<Slide
						v-for="index in count"
						:key="index"
						class="slide w-full"
				>
					<slot :name="`slot-${index}`" />
				</Slide>
				<template #addons>
					<Navigation v-if="useDefaultNavigation" />
					<Pagination />
				</template>
			</Carousel>
			<div v-if="!useDefaultNavigation">
				<span
						class="nav-prev"
						@click="prev"
				>
					<font-awesome-icon :icon="['fas', 'angle-left']" />
				</span>
				<span
						class="nav-next"
						@click="next"
				>
					<font-awesome-icon :icon="['fas', 'angle-right']" />
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.slider {
	@apply relative;

	.nav-next,
	.nav-prev {
		@apply
			absolute z-[1]
			cursor-pointer hidden
			text-[2rem] text-[var(--main-text-color)]
		;

		top: calc(50% - 2rem);

		&:hover {
			@apply text-[var(--third-hover-color)];
		}

		span {
			@apply
				flex justify-center items-center
				bg-[var(--body-bg-color)]
				w-[3rem] h-[3rem] rounded-full;
		}
	}

	.nav-prev {
		@apply left-[10px];
	}

	.nav-next {
		@apply right-[10px];
	}

	&:hover .nav-prev,
	&:hover .nav-next {
		@apply block;
	}
}
</style>

<style lang="scss">
.slider {
	.carousel__prev,
	.carousel__next,
	.carousel__pagination-button {
		@apply text-[var(--main-dark-text-color)];
	}

	.carousel__pagination-button {
		@apply bg-[var(--second-border-color)];
	}

	.carousel__pagination-button--active {
		@apply bg-[var(--main-dark-text-color)];
	}
}
</style>
