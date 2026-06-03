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
	wrapAround: true,
	autoHeight: false
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
				<div class="slide-content">
					<template v-if="slide.image">
						<template v-if="slide.image.mime_type === 'mp4'">
							<video
									:src="slide.image.src"
									autoplay loop muted
									class="media-object"
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
									class="media-object clickable"
							>
							<img
									v-else
									class="media-object"
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
				</div>
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

	:deep(.carousel),
	:deep(.carousel__viewport),
	:deep(.carousel__track) {
		height: 406px;

		@media (max-width: 768px) {
			height: auto;
		}
	}

	:deep(.carousel__slide) {
		height: 406px;

		@media (max-width: 768px) {
			height: auto;
		}
	}

	.slide-content {
		position: relative;
		width: 100%;
		height: 406px;
		overflow: hidden;

		@media (max-width: 768px) {
			height: auto;
			aspect-ratio: 4 / 3;
		}

		@media (max-width: 480px) {
			aspect-ratio: 3 / 4;
		}
	}

	.media-object {
		@apply w-full h-full object-cover;

		&.clickable {
			@apply cursor-pointer;
		}
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

		@media (max-width: 768px) {
			font-size: 40px;
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

.flip-text-box {
	@apply absolute bottom-[20px] left-[20px] z-[2];

	@media (max-width: 768px) {
		@apply bottom-[15px] left-[15px];
		font-size: 1.2rem;
	}
}
</style>
