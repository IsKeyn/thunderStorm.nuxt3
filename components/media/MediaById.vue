<script setup>
import LightBox from '@/components/media/LightBox.vue'

import { onMounted } from "vue";

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage,
} = lightBox();

onMounted(() => {
	document.addEventListener("click", event => {
		const target = event.target.closest('[media-id]:not([media-id=""])');
		if (target) {
			setMediaObj(event);
		}
	}, false);
})

const setMediaObj = (event) => {
	setOpenedImage(Number(event.target.getAttribute('media-id')));
}
</script>

<template>
	<LightBox
			v-if="openedImage"
			:mediaId="openedImage"
			@setCurrentElement="setOpenedImage"
	/>
</template>
