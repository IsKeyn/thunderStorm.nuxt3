<script setup>
import CookieAccept from '@/components/actions/CookieAccept.vue';
import SystemComponents from '@/components/system/SystemComponents.vue';
import ReceiveMainData from '@/modules/boardGame/components/boardGame/ReceiveMainData.vue';



import Seo from '@/modules/boardGame/components/boardGame/Seo.vue';



import Notifications from '@/components/notifications/Notifications.vue';



import Header from '@/modules/boardGame/components/layout/Header.vue';
import Footer from '@/modules/boardGame/components/layout/Footer.vue';




import MainMenu from '@/modules/boardGame/components/menu/MainMenu.vue';

import Sound from '@/components/audio/Sound.vue';

import { settings } from '@/composables/settings.js'
const { getSettingFirstValue } = settings();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();

/* Предоставляем данные через provide */
provide('layoutMethods', {
	setOpenedImage,
})
</script>

<template>
	<CookieAccept />

	<div v-if="!Boolean(Number(getSettingFirstValue('disable-events')))">
		<SystemComponents />
		<ReceiveMainData />

		<Seo />

		<div class="board-game-main">
			<div id="modals" />
			<template v-if="boardGameStore.boardGameInfo">
				<Header />
				<article>
					<div class="flex">
						<MainMenu />
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
		<Sound />
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="В данный момент ивенты отключены"
	/>
</template>

<style lang="scss">
/* Основные стили сайта */
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
@import url('~/assets/scss/Dashboard/themes/WinterLight.scss');
</style>

<style lang="scss" scoped>
body {
	.board-game-main {
		article {
			@apply pb-0 pl-0 pr-0;

			.content-box {
				@apply
					w-full
					pt-[1rem] pb-[1rem]
					pl-[var(--main-mobile-left-padding)] pr-[var(--main-mobile-right-padding)]
					lg:pl-[2rem] lg:pr-[var(--main-right-padding)]
				;
			}
		}
	}
}
</style>
