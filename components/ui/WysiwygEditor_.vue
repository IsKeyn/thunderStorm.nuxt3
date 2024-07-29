<script setup>
import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

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

const wysiwyg = ref('');
const editable = ref('');
const htmlMode = ref(false);

wysiwyg.value = props.modelValue;
editable.value = props.modelValue;

// watch(() => props.modelValue, (newValue) => {
// 	value.value = toRaw(newValue);
// }, { deep: true });

watch(() => wysiwyg, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });


const inputHandler = (event) => {
	setWysiwygValue(htmlMode.value ? event.target.innerText : event.target.innerHTML);
}

const setWysiwygValue = (value) => {
	wysiwyg.value = value;
	history.value.push(wysiwyg.value);
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
		} else {
			if (changeParams.tag) {
				let editableString = '';

				if (changeParams.class) {
					editableString = `<${changeParams.tag} class="${changeParams.class}">${select.toString()}</${changeParams.tag}>`;
				} else {
					editableString = `<${changeParams.tag}>${select.toString()}</${changeParams.tag}>`;
				}

				select.pasteHTML(editableString);
			}
		}

		// if (htmlMode.value) {
		// 	editable.value = editorRef.value.innerText;
		// }

		// emit('update:modelValue', editorRef.value.innerHTML);

		// if (htmlMode.value) {
		// 	wysiwyg.value = editorRef.value.innerText;
		// } else {
		// 	wysiwyg.value = editorRef.value.innerHTML;
		// }

		setWysiwygValue(htmlMode.value ? editorRef.value.innerText : editorRef.value.innerHTML);
	}
}

// Сохранять историю и сделать кнопку возврата и повтора если есть
// Определять теги и делать отмену тега при повторном нажатии

</script>

<template>
	<div class="wysiwyg-parent-box">
		<div class="wysiwyg-control-panel">
			<button
					class="btn btn-simple"
					title="Курсив"
					@click.prevent="setItem({ tag: 'i' })"
			>i</button>
			<button
					class="btn btn-simple"
					title="Полужирным"
					@click.prevent="setItem({ tag: 'b' })"
			>b</button>
			<button
					class="btn btn-simple"
					title="Параграф"
					@click.prevent="setItem({ tag: 'p' })"
			>p</button>

			<button
					class="btn btn-simple"
					@click.prevent="setItem({ tag: 'span', class: 'item' })"
			>Предмет</button>

			<button
					:class="[
							'btn btn-simple',
							htmlMode ? 'active' : ''
					]"
					@click.prevent="htmlMode = !htmlMode"
			>html</button>
		</div>
		<div
				v-if="htmlMode"
				class="wysiwyg-content"
				ref="editorRef"
				@input="inputHandler"
				@blur="setEditableValue"
				:contenteditable="editMode"
		>
			{{ editable }}
		</div>
		<div
				v-else
				class="wysiwyg-content"
				ref="editorRef"
				@input="inputHandler"
				@blur="setEditableValue"
				v-html="editable"
				:contenteditable="editMode"
		/>
	</div>
</template>

<style lang="scss" scoped>
.wysiwyg-parent-box {
	&:hover {
		.wysiwyg-control-panel {
			@apply block;
		}
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
