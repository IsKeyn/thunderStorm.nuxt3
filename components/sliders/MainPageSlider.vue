<script setup>
import 'vue3-carousel/carousel.css'

import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import Preloader from '@/components/ui/Preloader.vue';
import LightBox from '@/components/media/LightBox.vue'

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage,
} = lightBox();

const notificationsModule = await import("@/composables/notifications.js");
const { alert, error } = notificationsModule.notifications();

import { api } from '@/composables/api.js'
import { ref } from "vue";
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

const {
	isMobile,
	onWindowResize,
} = mobile();

const fetchedData = ref([]);
const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}slide/listByType`;

			const query = {
				type: 1,
			};
			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									fetchedData.value = response._data.data;
								} else {
									error('Slider request error', 5000);
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const carouselConfig = {
	itemsToShow: 1,
	wrapAround: true
}

const carouselRef = ref()

const next = () => carouselRef.value.next();
const prev = () => carouselRef.value.prev();

const router = useRouter();

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
			class=""
			:height="406"
			:autoplay="3000"
			:pauseAutoplayOnHover="true"
			:transition="750"
			:wrapAround="true"
	>
		<Slide v-if="requestInProgress" class="cap flex justify-center items-center text-[5rem]">
			<Preloader />
		</Slide>
		<Slide
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
							:src="slide.image.src"
							:alt="slide.name"
							@click="setOpenedImage(slide.image)"
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

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.slider {
	@apply
		relative
		overflow-hidden
	;

	a,
	img,
	video {
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
