<script setup>
import SystemComponents from '@/components/system/SystemComponents.vue';
import LoadingComponents from '@/components/system/LoadingComponents.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import MediaById from '@/components/media/MediaById.vue';
// import Head from '@/components/seo/Head.vue';

import Header from '@/modules/boardGame/components/layout/Header.vue';
import Footer from '@/modules/boardGame/components/layout/Footer.vue';

import SystemPlayerComponents from '@/modules/boardGame/components/user/player/SystemPlayerComponents.vue';

import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

const runtimeConfig = useRuntimeConfig();

import { ref } from "vue";

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();

const route = useRoute();

const requestName = 'boardGameShortInfoRequest';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			let request = `${apiUrl.value}board-game/get/${route.params.slug}`;

			const query = {
				type: 'short',
			};
			const sessionCookie = useCookie(sessionCookieName.value);

			try {
				loadState.loadList[requestName] = {
					name: requestName,
					type: 'useAsyncData',
					preloaderType: 'fullscreen',
					status: 'load',
				};

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
							}
						},
				);

				if (!response) {
					throw showError({
						statusCode: 404,
						message: 'Игра не найдены'
					});
				} else {
					if (loadState.loadList[requestName]) {
						loadState.loadList[requestName].status = 'finish';
					}

					return response.data;
				}
			} catch (e) {
				if (loadState.loadList[requestName]) {
					loadState.loadList[requestName].status = 'error';
				}
				errorHandler(e);
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

const fetchedData = computed(() => requestData.value || null);

// Предоставляем данные через provide
provide('boardGameInfo', fetchedData)
provide('layoutMethods', {
	setOpenedImage,
})

const menu = ref([
	{
		name: 'Главная',
		path: '/e/' + route.params.slug + '/',
		icon: ['fas', 'house']
	},
	{
		name: 'Игроки',
		path: '/e/' + route.params.slug + '/player',
		icon: ['fas', 'trophy']
	},
	{
		name: 'Доска',
		path: '/board',
		icon: ['fas', 'dice']
	},
	{
		name: 'Игры',
		path: '/games',
		icon: ['fas', 'gamepad']
	},
	{
		name: 'Предметы',
		path: '/items',
		icon: ['fas', 'hat-wizard']
	},
	{
		name: 'Настройки',
		path: '/settings',
		icon: ['fas', 'sliders']
	},
	{
		name: 'Обсуждение',
		path: '/e/' + route.params.slug + '/discussion/',
		icon: ['fa-solid', 'fa-message']
	},
]);
</script>

<template>
	<SystemComponents />
	<LoadingComponents />
	<MediaById />
	<SystemPlayerComponents />
<!--	<Head-->
<!--			:seo="{-->
<!--					title: fetchedData.name,-->
<!--			}"-->
<!--	/>-->

	<div class="main">
		<div id="modals" />
		<template v-if="fetchedData">
			<Header
					:boardGameInfo="fetchedData"
			/>
			<article>
				<div class="flex">
					<ui-SideMenu
							:menu="menu"
					/>
					<div class="content-box">
						<slot />
					</div>
				</div>
			</article>
			<Notifications />
			<Footer />
		</template>
	</div>

	<media-LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss">
/* Основные стили сайта */
@import url('~/assets/scss/vars.scss');
@import url('~/assets/scss/style.scss');

/* Стили темы, используемой на сайту */
@import url('~/assets/scss/InSilentHill/vars.scss');
@import url('~/assets/scss/InSilentHill/style.scss');
@import url('~/assets/scss/InSilentHill/fonts.scss');
@import url('~/assets/scss/InSilentHill/imports.scss');

/* Стили тем оформления, доступных для выбора */
@import url('~/assets/scss/Dashboard/style.scss');
@import url('~/assets/scss/Dashboard/themes/Green.scss');
@import url('~/assets/scss/Dashboard/themes/Ocean.scss');
@import url('~/assets/scss/Dashboard/themes/Street.scss');
@import url('~/assets/scss/Dashboard/themes/StreetLight.scss');

body {
	.main {
		article {
			@apply pb-0 pl-0;

			.content-box {
				@apply w-full m-[1rem];
			}
		}
	}
}
</style>
