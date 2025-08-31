<script setup>
const props = defineProps({
	loadList: {
		type: Object,
		default: {},
	},
});

import { helper } from '@/composables/helper.js'
const {
	filterByPairFieldValue,
} = helper();

const firstLoad = ref(true);

const showPreloader = computed(() => {
	let returnData = false;

	const loadItems = filterByPairFieldValue(props.loadList, 'status', 'load');

	if (Object.keys(loadItems).length > 0) {
		returnData = true;
	}

	return returnData;
});
</script>

<template>
	<div v-if="showPreloader" class="fullscreen-transparent-preloader">
		<ui-BigPreloader />
	</div>
</template>

<style lang="scss" scoped>
	.fullscreen-transparent-preloader {
		@apply fixed z-[99998] flex justify-center items-center w-[100vw] h-[100vh] bg-black/50;
	}
</style>
