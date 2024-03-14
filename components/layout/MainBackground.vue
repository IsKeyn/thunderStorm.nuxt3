<script setup>
const backgroundStyle = computed(() => {
	let backgroundStyles = '';
	const setting = getSettingByCode('background_image');

	backgroundStyles += `background: url('${setting && setting[0] ? setting[0].value : '' }') no-repeat;`;
	backgroundStyles += "background-position: center;";
	backgroundStyles += "background-size: 100% auto;";

	return backgroundStyles;
});

// TODO перенести в отдельный composables
import { useSettingsStore } from '@/stores/settings';
const settingStore = useSettingsStore();

const getSettingByCode = (code) => {
	if (code) {
		return toRaw(settingStore.settings).filter((item) => {
			if (item.code === code) {
				return true;
			}
		});
	}
}
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
