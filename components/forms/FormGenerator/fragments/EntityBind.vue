<script setup>
import EntityList from './EntityList.vue';

import { ref, watch, onMounted } from "vue";

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({ entity: null, id: null })
	}
});

const entityValue = ref(null);
const entityIdValue = ref(null);
const body = ref({});

// Инициализация значений из props
onMounted(() => {
	if (props.modelValue) {
		entityValue.value = props.modelValue.entity;
		entityIdValue.value = props.modelValue.id;

		if (entityValue.value) {
			body.value = { entity: entityValue.value };
		}
	}
});

// Отслеживание изменения entity
watch(entityValue, (newEntity) => {
	if (newEntity) {
		body.value = { entity: newEntity };
	} else {
		entityIdValue.value = null;
		body.value = {};
	}
	updateModelValue();
});

// Отслеживание изменения ID
watch(entityIdValue, updateModelValue);

// Отслеживание изменения props извне
watch(() => props.modelValue, (newValue) => {
	if (newValue) {
		// Предотвращаем циклическое обновление
		if (newValue.entity !== entityValue.value) {
			entityValue.value = newValue.entity;
		}
		if (newValue.id !== entityIdValue.value) {
			entityIdValue.value = newValue.id;
		}
	}
}, { deep: true });

// Функция для эмита события
function updateModelValue() {
	const newValue = {
		entity: entityValue.value,
		id: entityIdValue.value
	};

	emit('update:modelValue', newValue);
}
</script>

<template>
	<EntityList
			v-model="entityValue"
			apiUrl="entity/getList"
			:hasResource="false"
	/>
	<EntityList
			v-if="entityValue"
			v-model="entityIdValue"
			apiUrl="entity/getFields"
			:body="body"
			:hasResource="false"
	/>
</template>
