<script setup>
import OlCard from './fragments/OlCard.vue';
import UlCard from './fragments/UlCard.vue';

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	previewMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

// Забираю элемент для репитора
const defaultStructure = await import(`./defaultStructure.json`);
</script>

<template>
	<OlCard
			v-if="blockStructure.settings.listType.value === 'ol'"
			:repeaterItem="defaultStructure.fields.elements[0]"
			:blockStructure="blockStructure"
			:blockIndex="blockIndex"
			:editMode="!previewMode"
	/>
	<UlCard
			v-if="blockStructure.settings.listType.value === 'ul'"
			:repeaterItem="defaultStructure.fields.elements[0]"
			:blockStructure="blockStructure"
			:blockIndex="blockIndex"
			:editMode="!previewMode"
	/>
</template>
