<script setup>
import SystemComponents from '@/components/system/SystemComponents.vue';
import Notifications from '@/components/notifications/Notifications.vue';

import('~/assets/scss/vars.scss');
import('~/assets/scss/style.scss');

const runtimeConfig = useRuntimeConfig();

/* TODO данный код отрабатывает не корректно и подключает также файлы остальных тем, разобраться (https://i.imgur.com/R13XKdl.png)
в данных момент решено через import в ~/assets/scss/style.scss , но это не корректное решение, так как тянутся все стили всех тем
import(`~/assets/scss/${runtimeConfig.public.theme}/vars.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/style.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/imports.scss`);
*/

import('~/assets/scss/InSilentHill/vars.scss');
import('~/assets/scss/InSilentHill/style.scss');
import('~/assets/scss/InSilentHill/fonts.scss');
import('~/assets/scss/InSilentHill/imports.scss');

const theme = computed(() => {
	return `${runtimeConfig.public.theme}_theme`;
});
</script>

<template>
	<div :class="theme">
		<div class="main">
			<SystemComponents />
			<div id="modals"></div>
			<article>
				<slot />
			</article>
			<Notifications />
		</div>
	</div>
</template>
