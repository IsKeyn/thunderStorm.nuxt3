<script setup>
import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
});

const editorRef = ref(null);

const wysiwyg = ref('');
const editable = ref('');

wysiwyg.value = props.modelValue;
editable.value = props.modelValue;

// watch(() => props.modelValue, (newValue) => {
// 	value.value = toRaw(newValue);
// }, { deep: true });

watch(() => wysiwyg, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });


const setWysiwygValue = (event) => {
	wysiwyg.value = event.target.innerHTML;
}

const setEditableValue = () => {
	editable.value = wysiwyg.value;
}

const setItem = (changeParams) => {
	const select = window.getSelection ? window.getSelection() : document.selection.createRange();

	if (select !== '') {
		if (select.getRangeAt) {
			const range = select.getRangeAt(0);

			if (changeParams.tag) {
				const newNode = document.createElement(changeParams.tag);

				if (changeParams.class) {
					newNode.setAttribute('class', changeParams.class);
				}

				range.surroundContents(newNode);
			}
		} else {
			if (changeParams.tag) {
				select.pasteHTML(`<${changeParams.tag}>${select.htmlText}</${changeParams.tag}>`);
			}
		}

		emit('update:modelValue', editorRef.value.innerHTML);
	}
}

// Сохранять историю и сделать кнопку возврата и повтора если есть
// Определять теги и делать отмену тега при повторном нажатии
// Чистыл html (приоритет)
//
</script>

<template>
	<div>
		<div>
			<button class="btn btn-simple" @click.prevent="setItem({ tag: 'span', class: 'item' })">Item</button>
			<button class="btn btn-primary" @click.prevent="setItem({ tag: 'i' })">i</button>
			<button class="btn btn-primary" @click.prevent="setItem({ tag: 'p' })">p</button>
		</div>
		<div
				ref="editorRef"
				@input="setWysiwygValue"
				@blur="setEditableValue"
				v-html="editable"
				contenteditable="true"
		/>
	</div>
</template>
