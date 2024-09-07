<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';

import defaultSettings from '@/components/blocks/json/defaultSettings.json';
import defaultGroups from '@/components/blocks/json/defaultGroups.json';

import { watch } from "vue";
import { blocks } from '@/composables/blocks.js'
const {
	getBlock,
} = blocks();

const props = defineProps({
	name: {
		type: String,
		default: null,
	},
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
</script>

<template>
	<div
			:class="[
				'th-block repeater-list-with-image',
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
		<component
				:is="getBlock(name)"
				:blockIndex="blockIndex"
				:structure="structure"
				:editMode="editMode"
		/>
	</div>
</template>
