<template>
	<!-- Обязательно ClientOnly, т.к. редактор работает с DOM -->
	<ClientOnly>
		<JsonEditorVue
				v-model="jsonData"
				:options="editorOptions"
				class="jse-theme-dark"
		/>
	</ClientOnly>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

// Динамический импорт + CSS (оптимально для Nuxt)
const JsonEditorVue = defineAsyncComponent(() => import('json-editor-vue'))
// import 'json-editor-vue/style.css' // проверьте путь в документации пакета
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

const jsonData = ref({
	user: {
		name: 'Иван',
		age: 28,
		roles: ['admin', 'editor'],
		settings: { theme: 'dark', notifications: true }
	},
	active: true
})

const editorOptions = {
	mode: 'tree',        // 🌳 Дерево с раскрытием вложенности
	search: true,        // 🔍 Поиск по JSON
	history: true,       // ↩️ Отмена/повтор действий
	mainMenuBar: true,   // 📋 Панель с кнопками (добавить, удалить, экспорт)
	navigationBar: true, // 📍 Навигация по путям
	onValidationError: (errors) => {
		console.warn('Валидация:', errors)
	}
}
</script>

<style scoped>
.json-editor-wrapper {
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	min-height: 400px;
}
</style>
