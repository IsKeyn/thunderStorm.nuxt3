<script setup>
import Modal from '@/components/modals/Modal.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';

import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {},
	/*
	* Тип работы формы
	*
	* 0 - дефолтное значение, value находится в элементе
	* 1 - новый формат работы, value отдельный пропс
	*
	*/
	formHandlerType: {
		type: Number,
		default: 0,
	},
	// Ключ value
	valueKey: {
		type: String,
		default: null,
	},
	// Отображаемое имя поля
	name: {
		type: [String, Number],
		required: true,
	},
	// Объект с данными поля
	element: {
		type: Object,
		default: {},
	},
	// Отображать или скрывать заголовок
	getFieldClasses: {
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

	if (props.formHandlerType === 1) {
		formValue.value = props.valueKey ? rawElement[props.valueKey] : rawElement;
		emit('update:modelValue', rawElement);
	} else {
		props.element.value = rawElement.id;
	}

	props.element.objectValue = rawElement;
}

const formValue = ref(null);

if (props.formHandlerType === 1) {
	if (props.modelValue) {
		formValue.value = props.valueKey ? props.modelValue[props.valueKey] : props.modelValue;

		props.element.objectValue = props.modelValue;
	}

	watch(() => props.modelValue, (newValue, oldValue) => {
		if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
			if (newValue) {
				formValue.value = props.valueKey ? newValue[props.valueKey] : newValue;
			}
		}
	}, { deep: true });

	watch(() => formValue, (newValue, oldValue) => {
			emit('update:modelValue', { id: newValue });
	}, { deep: true });
}
</script>

<template>
	<div class="grid grid-cols-4">
		<div class="col-span-2">
			<input
					v-if="formHandlerType === 1"
					v-model="formValue"
					type="text"
					:name="name"
					:friendly-name="element.name"
					:placeholder="element.placeholder"
			/>
			<input
					v-else
					v-model="element.value"
					type="text"
					:name="name"
					:friendly-name="element.name"
					:placeholder="element.placeholder"
			/>
			<div
					class="choice-file-block"
					:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
			>
				<div
						class="button choice-btn btn-primary"
						@click="toggleGalleryModal"
				>Обзор...</div> {{ element.value ? element.value : '' }}
			</div>
		</div>
		<div v-if="element.objectValue && element.objectValue.src" class="col-span-2 text-center">
			<img
					:src="element.objectValue.src"
					:media-id="element.objectValue.id"
					class="inline-block max-w-[500px] max-h-[500px] media-obj"
			>
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
