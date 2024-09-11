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
		if (event.target.matches(".media-obj")) {
			setMediaObj(event)
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
