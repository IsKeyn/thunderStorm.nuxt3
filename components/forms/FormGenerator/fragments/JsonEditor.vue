<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from 'vue'

const emit = defineEmits(["update:modelValue"]);

// Динамический импорт + CSS (оптимально для Nuxt)
const JsonEditorVue = defineAsyncComponent(() => import('json-editor-vue'))
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

const props = defineProps({
	modelValue: null,
});

const jsonData = ref({ ...props.modelValue } ?? {});

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

watch(() => props.modelValue, (newValue) => {
	jsonData.value = newValue;
}, { immediate: true });

watch(() => jsonData.value, (newValue) => {
	emit("update:modelValue", JSON.stringify(newValue));
}, { deep: true });
</script>

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

<style lang="scss" scoped />
