<script setup>
import Modal from '@/components/modals/Modal.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';

import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {},
});

const activeGalleryModal = ref(false);

const toggleGalleryModal = () => {
	activeGalleryModal.value = !activeGalleryModal.value;
}

const selectThisElement = (element) => {
	toggleGalleryModal();
	formValue.value = toRaw(element);
}

const formValue = ref(null);
formValue.value = props.modelValue;

watch(() => props.modelValue, (newValue, oldValue) => {
	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		formValue.value = newValue;
	}
}, { deep: true });

watch(() => formValue.value, (newValue, oldValue) => {
	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		emit('update:modelValue', newValue);
	}
}, { deep: true });

const setNewValue = () => {
	formValue.value = { id: Number(formValue.value.id) };
}
</script>

<template>
	<div class="grid grid-cols-4">
		<div class="col-span-2">
			<input
					v-model="formValue.id"
					type="text"
					:friendly-name="formValue.name"
					@change="setNewValue"
			/>
			<div class="choice-file-block">
				<div
						class="button choice-btn btn-primary"
						@click="toggleGalleryModal"
				>Обзор...</div> {{ formValue && formValue.id ? formValue.id : '' }}
			</div>
		</div>
		<div v-if="formValue && formValue.src" class="col-span-2 text-center">
			<img :src="formValue.src" class="inline-block max-w-[500px] max-h-[500px]">
		</div>
	</div>

	<Modal
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
</template>
