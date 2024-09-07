<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import OlCard from '@/components/blocks/Article/RepeaterLists/fragments/OlCard.vue';
import UlCard from '@/components/blocks/Article/RepeaterLists/fragments/UlCard.vue';

import defaultSettings from '@/components/blocks/json/defaultSettings.json';
import defaultGroups from '@/components/blocks/json/defaultGroups.json';

import { blocks } from '@/composables/blocks.js';
import { watch } from "vue";

const props = defineProps({
	structure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	editMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

const previewMode = ref(false);
previewMode.value = !props.editMode;

const repeaterItem = {
	item: 'Элемент списка',
};

const defaultStructure = {
	fields: {
		elements: [
			{ ...repeaterItem },
		],
	},
	settings: {
		active: {
			value: true,
		},
		listType: {
			name: 'Тип списка',
			value: 'ul',
			type: 'select',
			options: [
				{
					name: 'Нумерованный',
					value: 'ol',
				},
				{
					name: 'Обычный',
					value: 'ul',
				}
			],
		},
		olStart: {
			name: 'Первый элемент нумерованного списка',
			value: 1,
			type: 'number',
		},
		editType: {
			name: 'Тип редактирования',
			value: 'simple',
			type: 'select',
			options: [
				{
					name: 'Простой',
					value: 'simple',
				},
				{
					name: 'Wysiwyg',
					value: 'wysiwyg',
				}
			],
		},
		...defaultSettings,
	},
	settingGroups: {
		...defaultGroups,
	},
};

const {
	blockStructure,
	setBlockStructure,
} = blocks(defaultStructure, props.structure, props.blockIndex, props.editMode);

watch(() => props.structure, (newValue) => { // TODO костылИЩЕ! Спасает от ситуации когда меняешь местами два одинаковых блока
	setBlockStructure();
}, { deep: true });

setBlockStructure();
</script>

<template>
	<div
			:class="[
				'th-block repeater-list',
				blockStructure.settings.overflow.value,
				blockStructure.settings.marginTop.value,
				blockStructure.settings.marginRight.value,
				blockStructure.settings.marginBottom.value,
				blockStructure.settings.marginLeft.value,
				blockStructure.settings.paddinTop.value,
				blockStructure.settings.paddinRight.value,
				blockStructure.settings.paddinBottom.value,
				blockStructure.settings.paddinLeft.value,
			]"
	>
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
				:previewMode="previewMode"
				@setPreviewMode="previewMode = !previewMode"
		/>
		<OlCard
				v-if="blockStructure.settings.listType.value === 'ol'"
				:repeaterItem="repeaterItem"
				:blockStructure="blockStructure"
				:blockIndex="blockIndex"
				:editMode="!previewMode"
		/>
		<UlCard
				v-if="blockStructure.settings.listType.value === 'ul'"
				:repeaterItem="repeaterItem"
				:blockStructure="blockStructure"
				:blockIndex="blockIndex"
				:editMode="!previewMode"
		/>
	</div>
</template>
