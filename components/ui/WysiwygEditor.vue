<script setup>
import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

import Modal from '@/components/modals/Modal.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	editMode: {
		type: Boolean,
		default: false,
	},
});

const editorRef = ref(null);

const history = ref([]);
const historyCurrentStep = ref(null);

const finalValue = ref('');
const wysiwyg = ref('');

const htmlMode = ref(false);

wysiwyg.value = props.modelValue;
history.value.push(wysiwyg.value);

watch(() => wysiwyg, (newValue) => {
	emit('update:modelValue', newValue.value);
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
	setWysiwygValue(newValue);
}, { deep: true });

const setHtmlMode = () => {
	htmlMode.value = !htmlMode.value;
}

const setHistoryTimeout = ref(null); // Только для Input

const inputHandler = (event) => {
	clearTimeout(setHistoryTimeout.value);

	setHistoryTimeout.value = setTimeout(() => {
		history.value.push(htmlMode.value ? event.target.innerText : event.target.innerHTML);
	}, 500);
}

const blurHandler = (event) => {
	if (!(event.relatedTarget && event.relatedTarget.classList.contains('js-set-button'))) {
		setWysiwygValue(htmlMode.value ? event.target.innerText : event.target.innerHTML);
	}
}

const setWysiwygValue = (value) => {
	wysiwyg.value = value;
	history.value.push(wysiwyg.value);
}

const timeMachine = (direction) => {
	const historyLength = history.value.length;

	if (historyLength > 1) {
		if (direction === 'back') {
			if (historyCurrentStep.value) {
				wysiwyg.value = history.value[historyCurrentStep.value - 1]
				historyCurrentStep.value = historyCurrentStep.value - 1;
			} else {
				wysiwyg.value = history.value[historyLength - 2]
				historyCurrentStep.value = historyLength - 2;
			}
		}

		if (direction === 'forward') {
			if (historyCurrentStep.value && (historyCurrentStep.value + 1 <= history.value.length - 1)) {
				wysiwyg.value = history.value[historyCurrentStep.value + 1]
			} else {
				// ytdjpvj;yj
			}
		}
	}
}

const setItem = (changeParams) => {
	const select = selectedItem.value ? selectedItem.value : (window.getSelection ? window.getSelection() : document.selection.createRange());

	if (select !== '') {
		if (select.getRangeAt) {
			const range = select.getRangeAt(0);

			if (changeParams.tag) {
				if (htmlMode.value) {
					let editableString = '';

					if (changeParams.class) {
						editableString = `<${changeParams.tag} class="${changeParams.class}">${select.toString()}</${changeParams.tag}>`;
					} else {
						editableString = `<${changeParams.tag}>${select.toString()}</${changeParams.tag}>`;
					}

					range.deleteContents();
					range.insertNode(document.createTextNode(editableString));
				} else {
					const newNode = document.createElement(changeParams.tag);

					if (changeParams.class) {
						newNode.setAttribute('class', changeParams.class);
					}

					range.surroundContents(newNode);
				}
			}

			if (changeParams.bbCode) {
				let editableString = '';

				editableString = `[${changeParams.bbCode}=${changeParams.id}]`;

				if (editableItem) { // TODO временный костыль, добавляет в конец строки, убрать когда будет решение по корректной выборки поля ввода
					editableItem.value.append(editableString);
					editableItem.value = null;
				} else {
					range.deleteContents();
					range.insertNode(document.createTextNode(editableString));
				}
			}
		}

		if (selectedItem.value) {
			selectedItem.value = null;
		}
		setWysiwygValue(htmlMode.value ? editorRef.value.innerText : editorRef.value.innerHTML);
	}
}

const selectedItem = ref(null);
const editableItem = ref(null);

const activeGalleryModal = ref(false);

const setImageFromLib = (event) => {
	// selectedItem.value = window.getSelection ? window.getSelection() : document.selection.createRange();
	editableItem.value = event.target.closest('.wysiwyg-parent-box').querySelector('.wysiwyg-content');
	toggleGalleryModal();
}


const toggleGalleryModal = () => {
	activeGalleryModal.value = !activeGalleryModal.value;
}

const selectThisElement = (element) => {
	toggleGalleryModal();
	setItem({bbCode: 'lightBox', id: element.id});
}

const mediaFromLib = () => {
	toggleGalleryModal();
}

</script>

<template>
	<div
			:class="[
					'wysiwyg-parent-box',
					editMode ? 'edit-mode' : ''
			]"
	>
		<div class="wysiwyg-control-panel">
			<button
					class="btn btn-simple js-set-button"
					title="Курсив"
					@click.prevent="setItem({ tag: 'i' })"
			>i</button>

			<button
					class="btn btn-simple js-set-button"
					title="Полужирным"
					@click.prevent="setItem({ tag: 'b' })"
			>b</button>

			<button
					class="btn btn-simple js-set-button"
					title="Параграф"
					@click.prevent="setItem({ tag: 'p' })"
			>p</button>

			<button
					class="btn btn-simple js-set-button"
					title="Параграф c центрированным по левому краю"
					@click.prevent="setItem({ tag: 'p', class: 'text-left' })"
			><font-awesome-icon :icon="['fas', 'align-left']" /></button>

			<button
					class="btn btn-simple js-set-button"
					title="Параграф c центрированным текстом"
					@click.prevent="setItem({ tag: 'p', class: 'text-center' })"
			><font-awesome-icon :icon="['fas', 'align-center']" /></button>

			<button
					class="btn btn-simple js-set-button"
					title="Параграф c текстом по правому"
					@click.prevent="setItem({ tag: 'p', class: 'text-right' })"
			><font-awesome-icon :icon="['fas', 'align-right']" /></button>

			<button
					class="btn btn-simple js-set-button"
					title="Разрыв строки"
					@click.prevent="setItem({ tag: 'br' })"
			>br</button>

			<button
					class="btn btn-simple js-set-button"
					@click.prevent="setItem({ tag: 'span', class: 'item' })"
			>Предмет</button>

			<button
					class="btn btn-simple js-set-button"
					@click.prevent="setItem({ tag: 'span', class: 'heal' })"
			>Аптечка</button>

			<button
					class="btn btn-simple js-set-button"
					@click.prevent="setItem({ tag: 'span', class: 'ammo' })"
			>Амуниция</button>

			<button
					class="btn btn-simple js-set-button"
					@click.prevent="setItem({ tag: 'span', class: 'epic' })"
			>Эпик</button>

			<button
					class="btn btn-simple js-set-button"
					title="Медиа из медиабиблиотеки"
					@click.prevent="setImageFromLib"
			><font-awesome-icon :icon="['fas', 'images']" /></button>

			<button
					:class="[
							'btn btn-simple',
							htmlMode ? 'active' : ''
					]"
					@click.prevent="setHtmlMode"
			>html</button>

			<button
					:class="[
							'btn btn-simple',
					]"
					@click.prevent="timeMachine('back')"
			><font-awesome-icon :icon="['fas', 'rotate-left']" /></button>

			<button
					:class="[
							'btn btn-simple',
					]"
					@click.prevent="timeMachine('forward')"
			><font-awesome-icon :icon="['fas', 'rotate-right']" /></button>
		</div>
		<div
				v-if="htmlMode"
				class="wysiwyg-content"
				ref="editorRef"
				@input="inputHandler"
				@blur="blurHandler"
				:contenteditable="editMode"
		>
			{{ wysiwyg }}
		</div>
		<div
				v-else
				class="wysiwyg-content"
				ref="editorRef"
				@input="inputHandler"
				@blur="blurHandler"
				v-html="wysiwyg"
				:contenteditable="editMode"
		/>
	</div>

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
</template>

<style lang="scss" scoped>
.wysiwyg-parent-box {
	@apply relative;

	&:hover {
		.wysiwyg-control-panel {
			@apply block;
		}
	}

	&.edit-mode {
		@apply min-w-[5rem];
	}

	.wysiwyg-control-panel {
		@apply absolute top-[-3rem] left-0 hidden;

		.btn {
			@apply mr-1;
		}
	}

	.wysiwyg-content {

	}
}
</style>
