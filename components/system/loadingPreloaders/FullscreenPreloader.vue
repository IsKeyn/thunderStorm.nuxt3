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

	if (firstLoad.value) {
		returnData = true;
	} else if (Object.keys(loadItems).length > 0) {
		returnData = true;
	}

	return returnData;
});

onMounted(() => {
	firstLoad.value = false;
})
</script>

<template>
	<div v-if="showPreloader" class="fullscreen-preloader">
		<games-RandomSquare />
	</div>
</template>


<style lang="scss" scoped>
.fullscreen-preloader {
	@apply fixed z-[50000] justify-center items-center w-[100vw] h-[100vh] bg-[var(--main-bg-color)];
	//@apply flex justify-center items-center min-h-[10rem] text-[5rem] text-[var(--main-title-color)] bg-[var(--main-bg-color)];
}
</style>
