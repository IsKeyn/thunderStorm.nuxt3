<script setup>
import WysiwygEditor from '@/components/ui/WysiwygEditor.vue';
import LightBox from '@/components/media/LightBox.vue'
import { onMounted } from 'vue'

import { lightBox } from '@/composables/lightBox.js';
const { openedImage, setOpenedImage } = lightBox();

const val = ref('Большой текст');
const ttt = ref(false);

const set = () => {
	ttt.value = true;
}

onMounted(() => {
	document.querySelector(".media-obj").addEventListener("click", (event) => { setMediaObj(event); });
})

const mediaId = ref(null);

const setMediaObj = (event) => {
	console.log(12312, event.target.getAttribute('media-id'));

	mediaId.value = Number(event.target.getAttribute('media-id'));
	ttt.value = true;
}
</script>


<template>
	<div>
		<span class="media-obj" media-id="199">yyyyyyyyyyyyyyyyyyyyyy</span>

		<button @click="set()">1231234</button>
		<LightBox
				v-if="ttt"
				:mediaId="mediaId"
				@setCurrentElement="setOpenedImage"
		/>

<!--		<WysiwygEditor-->
<!--			v-model="val"-->
<!--		/>-->
	</div>
</template>
