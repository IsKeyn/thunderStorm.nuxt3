<script setup>
const emit = defineEmits(["update:modelValue"]);

import { ref, defineAsyncComponent, watch } from 'vue';

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

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

// Функция нормализации: всегда возвращает объект
const normalizeValue = (value) => {
	if (typeof value === 'string') {
		try {
			// Пустую строку превращаем в пустой объект
			return value.trim() ? JSON.parse(value) : {};
		} catch (e) {
			error('Ошибка парсинга JSON:', e);
			// При ошибке парсинга возвращаем последнее валидное значение или пустой объект
			return { ...jsonData.value };
		}
	}
	// Если уже объект — возвращаем как есть
	return value ?? {};
};

watch(() => props.modelValue, (newValue) => {
	jsonData.value = normalizeValue(newValue);
}, { immediate: true });

watch(() => jsonData.value, (newValue) => {
	const normalized = normalizeValue(newValue);
	emit("update:modelValue", normalized);
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
