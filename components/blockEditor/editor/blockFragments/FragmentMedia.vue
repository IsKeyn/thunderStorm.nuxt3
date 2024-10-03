<script setup>
import LightBox from '@/components/media/LightBox.vue'
import Modal from '@/components/modals/Modal.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';
import FixedControlPanelWithSettings from '@/components/blockEditor/editor/editorFragments/FixedControlPanelWithSettings.vue';

import fragmentMediaSettings from '@/components/blockEditor/editor/json/fragmentMediaSettings.json';

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage,
} = lightBox();

import { api } from '@/composables/api.js'
const { handleBackendUrl } = api();

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	/* Объект с данными поля */
	modelValue: {
		type: Array,
		default: {},
	},
	editMode: {
		type: Boolean,
		default: false,
	},
	imageClass: {
		type: String,
		default: '',
	},
});

const activeGalleryModal = ref(false);
const toggleGalleryModal = () => {
	activeGalleryModal.value = !activeGalleryModal.value;
}

const selectThisElement = (element) => {
	toggleGalleryModal();
	const rawElement = toRaw(element);

	rawElement.src = handleBackendUrl(rawElement.src, true);

	rawElement.settings = structuredClone(fragmentMediaSettings);
	emit('update:modelValue', rawElement);
}

const imageHandler = (image) => {
	if (props.editMode) {
		toggleGalleryModal();
	} else {
		setOpenedImage(image);
	}
}

const fixedControlPanelWithSettingsRef = ref(null);
</script>

<template>
	<div :class="['image-wrapper', imageClass]">
		<img
				v-if="modelValue && modelValue.src"
				:src="handleBackendUrl(modelValue.src)"
				:class="[
					modelValue?.settings?.classes?.value,
					modelValue?.settings?.width?.value,
					modelValue?.settings?.height?.value,
				]"
				@click="imageHandler(modelValue)"
		>
		<div
				v-else-if="editMode"
				@click="imageHandler(modelValue)"
		>
			<font-awesome-icon
					:icon="['far', 'image']"
					:class="['!w-[200px] !h-[200px] cursor-pointer']"
			/>
		</div>

		<div class="control-panel" v-if="editMode && modelValue && modelValue.src">
			<button
					class="btn btn-simple"
					title="Настройки блока"
					@click="fixedControlPanelWithSettingsRef.togglePanel()"
			>
				<font-awesome-icon :icon="['fas', 'sliders']" />
			</button>
		</div>
	</div>

	<FixedControlPanelWithSettings
			v-if="editMode"
			ref="fixedControlPanelWithSettingsRef"
			title="Настройки медиа фрагмента"
			:settings="modelValue.settings"
	/>

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
				galleryType="simple"
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
.image-wrapper {
	@apply relative;

	&:hover {
		> .control-panel {
			@apply block;
		}
	}

	> .control-panel {
		@apply absolute hidden bottom-0 left-0;
	}

	img {
		@apply cursor-pointer;
	}
}
</style>
