<script setup>
import { settings } from '@/composables/settings.js'
const { getSettingByCode } = settings();

import { api } from '@/composables/api.js'
const { handleBackendUrl } = api();

const backgroundStyle = computed(() => {
	let backgroundStyles = '';
	const setting = getSettingByCode('background_image');

	backgroundStyles += `background: url('${setting && setting[0] ? handleBackendUrl(setting[0].value) : '' }') no-repeat;`;
	backgroundStyles += "background-position: center;";
	backgroundStyles += "background-size: 100% auto;";

	return backgroundStyles;
});
</script>

<template>
	<ClientOnly>
		<div
				class="background"
				:style="backgroundStyle"
		>
			<div class="vein"/>
		</div>
	</ClientOnly>
</template>

<style lang="scss" scoped>
.background {
	@apply fixed top-0 z-[-1] w-full h-full;
}
</style>
