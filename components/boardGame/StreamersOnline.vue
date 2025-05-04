<script setup>
import ThunderSlider from '@/components/sliders/ThunderSlider.vue';
import Preloader from '@/components/ui/Preloader.vue';
import TwitchCard from '@/components/twitch/TwitchCard.vue';

import { ref } from 'vue'

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

const fetchedData = ref([]);
const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/getStreamersOnline`;

			const query = {
				boardGameId: props.boardGameId,
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
									fetchedData.value = response._data;
								} else {
									error('request error', 5000);
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
</script>

<template>
	<span class="user-interface-title">Участники онлайн</span>
	<div
			v-if="fetchedData"
			class="streamers-online"
	>
		<ThunderSlider
				:autoLoop="{
						delay: 12000,
						restart: 12000,
					}"
		>
			<template #nav-prev>
				<div id="nav-prev" class="nav-prev">
					<span><font-awesome-icon :icon="['fas', 'angle-left']" /></span>
				</div>
			</template>

			<template #nav-next>
				<div id="nav-next" class="nav-next">
					<span><font-awesome-icon :icon="['fas', 'angle-right']" /></span>
				</div>
			</template>

			<div
					class="slide w-full"
					v-for="(channel, index) in fetchedData"
					:key="index"
			>
				<TwitchCard :channel="channel" />
			</div>
		</ThunderSlider>
	</div>
	<div v-else>
		Сейчас никто не стримит *(
	</div>
</template>

<style lang="scss">
.streamers-online {
	.slider {
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
	}

	iframe {
		width: 100%;
		min-height: 245px;
	}
}
</style>
