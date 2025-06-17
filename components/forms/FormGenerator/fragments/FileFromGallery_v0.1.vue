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

	/* TODO от части костыль, из-за перестроения репитора модалки перестраиваются и наблюдатель внутри модалки не видит изменение modalActive */
	const body = document.querySelector('body');
	if (body.classList.contains('overflow-hidden')) {
		body.classList.remove('overflow-hidden');
	}
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
		// TODO почему не срабатывает при изменении sort?
		emit('update:modelValue', newValue);
	}
}, { deep: true });

const setNewValue = () => {
	formValue.value = {
		id: Number(formValue.value.id),
		sort: formValue.value.sort,
	};
}

const setNewSort = () => {
	emit('update:modelValue', formValue.value);
}
</script>

<template>
	<div class="grid grid-cols-4">
		<div class="col-span-2">

			<label>
				Сортировка
				<input
						v-model="formValue.sort"
						type="text"
						class="block"
						placeholder="Сортировка"
						@change="setNewSort"
				/>
			</label>

			<!--					:friendly-name="formValue.name"-->
			<!--					@change="setNewValue"-->

			<input
					v-model="formValue.id"
					type="text"
					class="block"
					placeholder="ID изображения"
					:friendly-name="formValue.name"

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
