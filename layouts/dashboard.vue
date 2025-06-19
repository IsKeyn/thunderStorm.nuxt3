<script setup>
import SystemComponents from '@/components/system/SystemComponents.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import MediaById from '@/components/media/MediaById.vue';

const runtimeConfig = useRuntimeConfig();

const theme = computed(() => {
	return `${runtimeConfig.public.theme}_theme`;
});
</script>

<template>
	<div :class="theme">
		<SystemComponents />
		<div class="main">
			<div id="modals"></div>
			<article>
				<slot />
			</article>
			<Notifications />
			<MediaById />
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
@import url('~/assets/scss/Dashboard/style.scss');

@import url('~/assets/scss/Dashboard/themes/Green.scss');
@import url('~/assets/scss/Dashboard/themes/Ocean.scss');
@import url('~/assets/scss/Dashboard/themes/Street.scss');
@import url('~/assets/scss/Dashboard/themes/StreetLight.scss');
</style>
