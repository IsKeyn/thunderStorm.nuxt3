<script setup>
import Modal from '@/components/modals/Modal.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';
import LightBox from '@/components/media/LightBox.vue'

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage,
} = lightBox();

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	// Объект с данными поля
	modelValue: {
		type: Array,
		default: {},
	},
	editMode: {
		type: Boolean,
		default: false,
	},
});

const activeGalleryModal = ref(false);

const toggleGalleryModal = () => {
	activeGalleryModal.value = !activeGalleryModal.value;
}

const selectThisElement = (element) => {
	toggleGalleryModal();
	const rawElement = toRaw(element);
	emit('update:modelValue', rawElement);
}

const imageHandler = (image) => {
	if (props.editMode) {
		toggleGalleryModal();
	} else {
		setOpenedImage(image);
	}
}
</script>

<template>
	<img
			v-if="modelValue && modelValue.src"
			:src="modelValue.src"
			@click="imageHandler(modelValue)"
	>
	<img
			v-else-if="editMode"
			src="/images/admin/no_image.jpg"
			@click="imageHandler(modelValue)"
	>

	<Modal
			v-if="editMode"
			:showOpenModal="activeGalleryModal"
			size="full-width"
			modal-id="gallery-modal"
			:fullCloseModal="true"
			@toggleModal="toggleGalleryModal"
	>
		<GalleryType1Component
				:selectButton="true"
				:hideBodyScrollLine="false"
				:setViewsLog="false"
				@selectThisElement="selectThisElement"
		/>
	</Modal>
	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
img {
	@apply cursor-pointer;
}
</style>
