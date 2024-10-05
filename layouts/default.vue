<script setup>
// useHead({
// 	link: [
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/vars.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/style.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/vars.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/style.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/fonts.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/imports.scss'
// 		},
// 	]
// })

import SystemComponents from '@/components/system/SystemComponents.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import FloatHeader from '@/components/headers/FloatHeader.vue';
import MainBackground from '@/components/layout/MainBackground.vue';
import Footer from '@/components/footers/Footer.vue';
import MediaById from '@/components/media/MediaById.vue';
import SideButton from '@/components/ui/SideButton.vue';

// import('~/assets/scss/vars.scss');
// import('~/assets/scss/style.scss');

const runtimeConfig = useRuntimeConfig();

/* TODO данный код отрабатывает не корректно и подключает также файлы остальных тем, разобраться (https://i.imgur.com/R13XKdl.png)
в данных момент решено через import в ~/assets/scss/style.scss , но это не корректное решение, так как тянутся все стили всех тем
import(`~/assets/scss/${runtimeConfig.public.theme}/vars.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/style.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/imports.scss`);
*/

// import('../assets/scss/InSilentHill/vars.scss');
// import('../assets/scss/InSilentHill/style.scss');
// import('../assets/scss/InSilentHill/fonts.scss');
// import('../assets/scss/InSilentHill/imports.scss');

const theme = computed(() => {
	return `${runtimeConfig.public.theme}_theme`;
});
</script>

<template>
	<div :class="theme">
		<SystemComponents />
		<MainBackground />
		<div class="main">
			<div id="modals"></div>
			<FloatHeader />
<!--				<NuxtLoadingIndicator /> // Прочитать про кастомизацию и кастомизировать -->
				<slot />
			</article>
			<Notifications />
			<MediaById />
			<SideButton
				title="Старая версия сайта"
				url="https://old.insilenthill.ru"
			/>
			<Footer />
		</div>
	</div>
</template>

<style lang="scss">
@import url('~/assets/scss/vars.scss');
@import url('~/assets/scss/style.scss');
@import url('~/assets/scss/InSilentHill/vars.scss');
@import url('~/assets/scss/InSilentHill/style.scss');
@import url('~/assets/scss/InSilentHill/fonts.scss');
@import url('~/assets/scss/InSilentHill/imports.scss');
</style>
