<script setup>
import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

import { helper } from '@/composables/helper.js'
const { filterByPairFieldValue } = helper();

const fullscreenLoads = computed(() => {
	return filterByPairFieldValue(loadState.loadList, 'preloaderType', 'fullscreen');
});

const fullscreenTransparentLoads = computed(() => {
	return filterByPairFieldValue(loadState.loadList, 'preloaderType', 'fullscreenTransparent');
});

const smallLoad = computed(() => {
	return filterByPairFieldValue(loadState.loadList, 'preloaderType', 'small');
});
</script>

<template>
	<system-loadingPreloaders-FullscreenPreloader
		:loadList="fullscreenLoads"
	/>

	<system-loadingPreloaders-FullscreenTransparentPreloader
			:loadList="fullscreenTransparentLoads"
	/>

	<system-loadingPreloaders-SmallPreloader
			:loadList="smallLoad"
	/>
</template>
