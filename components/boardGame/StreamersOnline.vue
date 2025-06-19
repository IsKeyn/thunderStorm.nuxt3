<script setup>
import 'vue3-carousel/carousel.css'

import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import ThunderSlider from '@/components/sliders/ThunderSlider.vue';
import Preloader from '@/components/ui/Preloader.vue';
import TwitchCard from '@/components/twitch/TwitchCard.vue';

import { onMounted, ref } from 'vue'

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const { data: requestData, pending: requestInProgress, refresh } = await useAsyncData(
		'boardGameStreamersOnlineKey',
		async () => {
			let request = `${apiUrl.value}board-game/getStreamersOnline`;

			const query = {
				boardGameId: props.boardGameId,
			};

			const sessionCookie = useCookie(sessionCookieName.value);

			try {
				const response = await $fetch(
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
							// onResponse({response}) {
							// 	if (response.status === 200) {
							// 		fetchedData.value = response._data;
							// 	} else {
							// 		error('request error', 5000);
							// 	}
							//
							// 	requestInProgress.value = false;
							// }
						},
				);

				return response;
			} catch (e) {
				errorHandler(e);
			}
		}
);

const fetchedData = computed(() => {
	return requestData.value || null;
});

const carouselConfig = {
	wrapAround: true,
	itemsToShow: 1,
	pauseAutoplayOnHover: true,
	autoplay: 15000,
	mouseWheel: true,
	transition: 750,
}

const carouselRef = ref()

const next = () => carouselRef.value.next();
const prev = () => carouselRef.value.prev();

const scriptTwitchIsOnline = ref(false);

onMounted(() => {
	if (process.client) {
		setShowStreamersBlockSetting();

		const script = document.createElement('script');
		script.src = 'https://player.twitch.tv/js/embed/v1.js';
		document.body.appendChild(script);
		script.onload = () => {
			scriptTwitchIsOnline.value = true;
		};
	}
});

const showStreamersBlock = ref(true);

const setShowStreamersBlockSetting = () => {
	if (process.client) {
		const showStreamersBlockLs = localStorage.getItem('show-streamers-block')

		if (showStreamersBlockLs !== null) {
			showStreamersBlock.value = JSON.parse(showStreamersBlockLs);
		}
	}
}

const setShowStreamerBlockValue = (value) => {
	showStreamersBlock.value = value;

	localStorage.setItem('show-streamers-block', showStreamersBlock.value)
}
</script>

<template>
	<span class="user-interface-title">
		Участники онлайн
		<font-awesome-icon v-if="showStreamersBlock" :icon="['fas', 'eye-slash']" class="cursor-pointer" @click="setShowStreamerBlockValue(false)" />
		<font-awesome-icon v-else :icon="['fas', 'eye']" class="cursor-pointer" @click="setShowStreamerBlockValue(true)" />
	</span>
	<template v-if="showStreamersBlock">
		<div
				v-if="fetchedData.length > 0"
				class="streamers-online"
		>
			<template v-if="fetchedData.length > 1">
				<Carousel
						v-if="scriptTwitchIsOnline"
						ref="carouselRef"
						v-bind="carouselConfig"
						class="w-full"
				>
					<Slide
							v-for="(channel, index) in fetchedData"
							:key="index"
							class="slide w-full"
					>
						<TwitchCard :channel="channel" />
					</Slide>
					<template #addons>
						<!--				<Navigation />-->
						<Pagination />
					</template>
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
			</template>
			<template v-else-if="fetchedData.length === 1">
				<div
						v-for="(channel, index) in fetchedData"
						:key="index"
						v-if="scriptTwitchIsOnline"
						class="w-full"
				>
					<TwitchCard
							:channel="channel"
					/>
				</div>
			</template>
		</div>
		<div v-else>
			Сейчас никто не стримит *(
		</div>
	</template>
</template>

<style lang="scss">
.streamers-online {
	@apply relative;

	.slide {
		@apply cursor-pointer;
	}

	.nav-next,
	.nav-prev {
		@apply
		absolute z-[1]
		cursor-pointer hidden
		text-[2rem]
		;

		top: calc(50% - 2rem);
		color: var(--main-text-color);

		&:hover {
			color: var(--third-hover-color);
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

	iframe {
		width: 100%;
		min-height: 200px;
	}
}
</style>

<style lang="scss">
.streamers-online {
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
