<script setup>
import Modal from '@/components/modals/Modal.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';

const props = defineProps({
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

	props.element.value = rawElement.id;
	props.element.objectValue = rawElement;
}
</script>

<template>
	<div class="grid grid-cols-4">
		<div class="col-span-2">
			<input
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
			<img :src="element.objectValue.src" class="inline-block max-w-[500px] max-h-[500px]">
		</div>
	</div>

	<Modal
			:showOpenModal="activeGalleryModal"
			size="full-width"
			modal-id="gallery-modal"
			@toggleModal="toggleGalleryModal"
	>
		<GalleryType1Component
				:selectButton="true"
				:hideBodyScrollLine="false"
				:setViewsLog="false"
				:fullCloseModal="true"
				@selectThisElement="selectThisElement"
		/>
	</Modal>
</template>
