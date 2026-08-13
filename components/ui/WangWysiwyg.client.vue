<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nAddResources, i18nChangeLanguage } from '@wangeditor/editor'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'

const props = defineProps({
	theme: {
		type: String,
		default: 'light', // 'light' или 'dark'
	},
	modelValue: {
		type: String,
		default: '<p>Текст</p>',
	}
})

const emit = defineEmits(['update:modelValue'])

// 1. Добавляем русский словарь
i18nAddResources('ru', {
	header: { title: 'Заголовки', text: 'Заголовок' },
	textStyle: { bold: 'Жирный', italic: 'Курсив', underline: 'Подчеркнутый' },
	listModule: { unOrderedList: 'Не нумерованный список', orderedList: 'Нумерованный список' },
	link: { insert: 'Вставить ссылку' },
	image: { netImage: 'Вставить изображение' },
	insertLink: { title: 'Вставить ссылку', text: 'Текст', url: 'URL', unLink: 'Удалить ссылку' },
	common: { ok: 'ОК', delete: 'Удалить', enter: 'Ввод' },
	blockQuote: { title: 'Цитата' },
	through: { title: 'Зачеркнутый' },
	code: { title: 'Встроенный код' },
	codeBlock: { title: 'Блок кода' },
	color: { title: 'Цвет текста', default: 'По умолчанию', clear: 'Очистить цвет' },
	bgColor: { title: 'Цвет фона', default: 'По умолчанию', clear: 'Очистить цвет' },
	fontSize: { title: 'Размер шрифта', default: 'По умолчанию' },
	fontFamily: { title: 'Шрифт', default: 'По умолчанию' },
	indent: { title: 'Увеличить отступ' },
	delIndent: { title: 'Уменьшить отступ' },
	justifyLeft: { title: 'По левому краю' },
	justifyRight: { title: 'По правому краю' },
	justifyCenter: { title: 'По центру' },
	justifyJustify: { title: 'По ширине' },
	bulletedList: { title: 'Маркированный список' },
	numberedList: { title: 'Нумерованный список' },
	insertImage: { title: 'Вставить изображение', alt: 'Alt текст', url: 'URL изображения' },
	uploadImage: { title: 'Загрузить изображение', failed: 'Загрузка не удалась' },
	table: { title: 'Таблица', insert: 'Вставить таблицу', delete: 'Удалить таблицу' },
	undo: { undo: 'Отменить', redo: 'Повторить' },
	fullScreen: { title: 'Полный экран' },
})

i18nChangeLanguage('ru')

const editorRef = shallowRef()
const valueHtml = ref(props.modelValue)
const isHtmlMode = ref(false)

// Синхронизация v-model с родителем
watch(valueHtml, (newValue) => {
	emit('update:modelValue', newValue)
})

// Если внешнее значение изменилось, обновляем редактор
watch(() => props.modelValue, (newValue) => {
	if (!isHtmlMode.value && editorRef.value && newValue !== valueHtml.value) {
		valueHtml.value = newValue
		editorRef.value.setHtml(newValue)
	}
})

const toolbarConfig = {
	toolbarKeys: [
		'headerSelect', 'bold', 'italic', 'underline', '|',
		'bulletedList', 'numberedList', '|',
		'insertLink', 'insertImage', '|',
		'undo', 'redo', '|',
		'codeBlock'
	]
}

const editorConfig = { placeholder: 'Введите текст...' }

const handleCreated = (editor) => {
	editorRef.value = editor
}

const toggleHtmlMode = () => {
	if (isHtmlMode.value) {
		if (editorRef.value) {
			editorRef.value.setHtml(valueHtml.value)
		}
	}
	isHtmlMode.value = !isHtmlMode.value
}

onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
})
</script>

<template>
	<ClientOnly>
		<div :class="['wang-wysiwyg-wrapper', `wang-wysiwyg-${theme}`]">

			<!-- Кнопка переключения режимов -->
			<div class="mode-toggle-bar">
				<button @click="toggleHtmlMode" class="mode-toggle-btn">
					{{ isHtmlMode ? '👁️ Визуальный режим' : '💻 HTML код' }}
				</button>
			</div>

			<!-- РЕЖИМ HTML -->
			<textarea
					v-if="isHtmlMode"
					v-model="valueHtml"
					class="html-textarea"
					:class="theme === 'dark' ? 'html-textarea-dark' : 'html-textarea-light'"
					placeholder="Введите HTML код..."
			></textarea>

			<!-- ВИЗУАЛЬНЫЙ РЕЖИМ -->
			<template v-else>
				<Toolbar
						:editor="editorRef"
						:defaultConfig="toolbarConfig"
						class="wang-toolbar"
				/>
				<Editor
						v-model="valueHtml"
						:defaultConfig="editorConfig"
						class="wang-editor"
						@onCreated="handleCreated"
				/>
			</template>

		</div>

		<template #fallback>
			<div class="wang-fallback">Загрузка редактора...</div>
		</template>
	</ClientOnly>
</template>

<style>
/* Обертка всего компонента */
.wang-wysiwyg-wrapper {
	border-radius: 6px;
	/* Убираем overflow: hidden, чтобы уголок растягивания не обрезался */
}

.wang-wysiwyg-light {
	border: 1px solid #ccc;
}

/* === ТЕМНАЯ ТЕМА === */
.wang-wysiwyg-dark {
	border: 1px solid #3b3b3b !important;

	--w-e-toolbar-bg-color: #1e1e1e !important;
	--w-e-toolbar-color: #e0e0e0 !important;
	--w-e-toolbar-border-color: #333333 !important;
	--w-e-toolbar-active-bg-color: #333333 !important;
	--w-e-toolbar-active-color: #ffffff !important;
	--w-e-toolbar-disabled-color: #666666 !important;

	--w-e-textarea-bg-color: #121212 !important;
	--w-e-textarea-color: #e0e0e0 !important;
	--w-e-textarea-border-color: #333333 !important;
	--w-e-textarea-placeholder-color: #666666 !important;
	--w-e-textarea-slight-border-color: #444444 !important;
	--w-e-textarea-slight-color: #aaaaaa !important;

	--w-e-dropdown-menu-bg-color: #1e1e1e !important;
	--w-e-modal-bg-color: #1e1e1e !important;
	--w-e-modal-color: #e0e0e0 !important;
	--w-e-modal-border-color: #333333 !important;
}

.wang-wysiwyg-dark .w-e-toolbar {
	border-bottom: 1px solid #333333 !important;
}

.wang-wysiwyg-dark .w-e-bar-divider {
	background-color: #444444 !important;
}

.wang-wysiwyg-dark .w-e-text-container pre {
	background-color: #2d2d2d !important;
	color: #f8f8f2 !important;
}

/* Панель с кнопкой переключения */
.mode-toggle-bar {
	display: flex;
	justify-content: flex-end;
	padding: 8px 12px;
	border-bottom: 1px solid #ccc;
}

.wang-wysiwyg-dark .mode-toggle-bar {
	border-bottom-color: #3b3b3b;
	background-color: #1e1e1e;
}

.mode-toggle-btn {
	padding: 6px 14px;
	border-radius: 4px;
	border: 1px solid #ccc;
	background-color: #f5f5f5;
	color: #333;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s;
}

.mode-toggle-btn:hover {
	background-color: #e0e0e0;
}

.wang-wysiwyg-dark .mode-toggle-btn {
	background-color: #2d2d2d;
	border-color: #444;
	color: #e0e0e0;
}

.wang-wysiwyg-dark .mode-toggle-btn:hover {
	background-color: #3d3d3d;
}

/* === ВИЗУАЛЬНЫЙ РЕДАКТОР: делаем его растягиваемым === */
.wang-editor {
	/* Задаем начальную высоту побольше */
	height: 500px;
	/* Минимальная высота, ниже которой сжать нельзя */
	min-height: 200px;
	/* МАГИЯ: разрешаем растягивать по вертикали */
	resize: vertical;
	/* Обязательно для работы resize: скролл внутри редактора */
	overflow-y: auto;
}

/* === HTML ТЕКСТОВОЕ ПОЛЕ: делаем его таким же растягиваемым === */
.html-textarea {
	width: 100%;
	height: 500px;
	min-height: 200px;
	resize: vertical; /* Разрешаем растягивать */
	overflow-y: auto;
	padding: 16px;
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 14px;
	line-height: 1.5;
	outline: none;
	box-sizing: border-box;
}

.html-textarea-light {
	background-color: #ffffff;
	color: #333333;
	border: none;
}

.html-textarea-dark {
	background-color: #121212;
	color: #e0e0e0;
	border: none;
}

/* Fallback заглушка */
.wang-fallback {
	border: 1px solid #ccc;
	border-radius: 6px;
	height: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #666;
}
</style>
