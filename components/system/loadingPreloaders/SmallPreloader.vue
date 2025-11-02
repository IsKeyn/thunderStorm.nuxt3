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
	<div v-if="showPreloader" class="small-preloader">
		<div class="icon-box">
			<ui-preloader />
		</div>
	</div>
</template>


<style lang="scss" scoped>
.small-preloader {
		@apply
			fixed bottom-[1rem] lg:bottom-[5rem] left-[1rem] lg:left-[5rem] z-[99998]
			w-[4rem] h-[4rem]
			bg-[var(--button-color-1)] rounded-full
			text-[var(--main-dark-text-color)] lg:text-[2rem];

		.icon-box {
			@apply flex justify-center items-center cursor-pointer w-full h-full;
		}
	;
}
</style>
