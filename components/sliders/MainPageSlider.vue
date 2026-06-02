<script setup>
import { computed, ref } from "vue";

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const requestName = 'mainPageSlider';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				type: 1,
			};

			const requestUrl = 'slide/listByType';
			const response = await Promise.resolve(
					sendApiRequest(requestUrl, 'GET', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);

const carouselRef = ref()

const carouselConfig = {
	itemsToShow: 1,
	wrapAround: true
}

const next = () => carouselRef.value.next();
const prev = () => carouselRef.value.prev();

const routeTo = (url) => {
	router.push({
		path: url,
	});
}
</script>

<template>
	<div v-if="fetchedData.length > 0" class="slider without-border">
		<Carousel
				ref="carouselRef"
				v-bind="carouselConfig"
				:height="406"
				:autoplay="3000"
				:pauseAutoplayOnHover="true"
				:transition="750"
				:wrapAround="true"
		>
			<Slide
					v-if="requestInProgress"
					class="cap flex justify-center items-center text-[5rem]"
			>
				<ui-BigPreloader
						class="h-full"
						theme="image"
						:themeType="9"
				/>
			</Slide>
			<Slide
					v-else
					v-for="(slide, index) in fetchedData"
					:key="index"
					class="slide w-full"
			>
				<template v-if="slide.image">
					<template v-if="slide.image.mime_type === 'mp4'">
						<video
								:src="slide.image.src"
								autoplay loop muted
						></video>
						<span
								v-if="slide.title"
								class="flip-text-box left"
						>
							{{ slide.title }}
						</span>
					</template>
					<template v-else>
						<img
								v-if="slide.url"
								:src="slide.image.src"
								:alt="slide.title"
								@click="routeTo(slide.url)"
						>
						<img
								v-else
								class="media-obj"
								:media-id="slide.image.id"
								:src="slide.image.src"
								:alt="slide.name"
						>
						<span
								v-if="slide.title"
								class="flip-text-box left"
						>
								{{ slide.name }}
							</span>
					</template>
				</template>
			</Slide>
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
</template>

<style lang="scss" scoped>
.slider {
	@apply relative overflow-hidden;

	a, img, video {
		@apply w-full;
	}

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
