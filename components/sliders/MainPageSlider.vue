<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

import ThunderSlider from '@/components/sliders/ThunderSlider.vue';
import {ref} from "vue";

const slides = ref([
	{
		type: 'img',
		source: '/slides/top.png',
		title: 'Город, покрытый туманом',
	},
	{
		type: 'img',
		source: '/slides/sh2-remake.jpg',
		title: 'Silent Hill 2 Remake 4k скриншоты',
		url: '/game/silent-hill-2-remake/media/',
	},
	// {
	// 	type: 'img',
	// 	source: '/slides/top.png',
	// 	title: 'Город, покрытый туманом3',
	// },
]);

const carouselConfig = {
	itemsToShow: 1,
	wrapAround: true
}

const carouselRef = ref()

const next = () => carouselRef.value.next();
const prev = () => carouselRef.value.prev();
</script>

<template>
	<div class="slider without-border">
	<Carousel
			ref="carouselRef"
			v-bind="carouselConfig"
			class=""
			:autoplay="3000"
			:pauseAutoplayOnHover="true"
			:transition="750"
			:wrapAround="true"
	>
		<Slide
				v-for="(slide, index) in slides"
				:key="index"
				class="slide w-full"
		>
			<template v-if="slide.type === 'video'">
				<video :src="slide.source" autoplay loop muted></video>
				<span
						v-if="slide.title"
						class="flip-text-box left"
				>
					{{ slide.title }}
				</span>
			</template>
			<template v-else>
				<a v-if="slide.url" :href="slide.url">
					<img :src="slide.source"
							 :alt="slide.title"
					>
					<span
							v-if="slide.title"
							class="flip-text-box left"
					>
					{{ slide.title }}
				</span>
				</a>
				<img v-else :src="slide.source"
						 :alt="slide.title"
				>
				<span
						v-if="slide.title"
						class="flip-text-box left"
				>
					{{ slide.title }}
				</span>
			</template>
		</Slide>

<!--		<template #addons>-->
<!--			<Navigation />-->
<!--			<Pagination />-->
<!--		</template>-->
	</Carousel>

	<div>
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

<!--	<ThunderSlider-->
<!--			:autoLoop="{-->
<!--				delay: 3000,-->
<!--				restart: 10000,-->
<!--			}"-->
<!--			sliderHeight="406px"-->
<!--			:withoutBorder="true"-->
<!--	>-->
<!--		<div-->
<!--				class="slide w-full"-->
<!--				v-for="(slide, index) in slides"-->
<!--				:key="index"-->
<!--		>-->
<!--			<template v-if="slide.type === 'video'">-->
<!--				<video :src="slide.source" autoplay loop muted></video>-->
<!--				<span-->
<!--						v-if="slide.title"-->
<!--						class="flip-text-box left"-->
<!--				>-->
<!--						{{ slide.title }}-->
<!--					</span>-->
<!--			</template>-->
<!--			<template v-else>-->
<!--				<img :src="slide.source"-->
<!--						 :alt="slide.title"-->
<!--				>-->
<!--				<span-->
<!--						v-if="slide.title"-->
<!--						class="flip-text-box left"-->
<!--				>-->
<!--						{{ slide.title }}-->
<!--					</span>-->
<!--			</template>-->
<!--		</div>-->
<!--	</ThunderSlider>-->
</template>

<style lang="scss" scoped>
.slide {
	@apply relative overflow-hidden;

	a,
	img,
	video {
		@apply w-full;
	}
}

.slider {
	@apply relative;

	.nav-next,
	.nav-prev {
		@apply
		absolute z-[1]
		cursor-pointer hidden
		text-[65px]
		;

		top: calc(50% - 32px);
		color: var(--main-text-color);

		&:hover {
			color: var(--second-hover-color);
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

.image-box {
	@apply
	relative
	flex justify-center items-center
	h-[350px]
	truncate
	cursor-pointer
	;

	.article-image {
		@apply w-full h-full object-cover;
	}
}
</style>
