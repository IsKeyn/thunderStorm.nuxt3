<script setup>
import ControlPanel from '@/components/blockEditor/editor/editorFragments/ControlPanel.vue';

import defaultSettings from '@/components/blockEditor/blocks/json/defaultSettings.json';
import defaultGroups from '@/components/blockEditor/blocks/json/defaultGroups.json';

import { watch } from "vue";
import { blocks } from '@/composables/blocks.js'
const {
	getBlock,
} = blocks();

const emit = defineEmits(['addBlock']);

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

const defaultStructure = {...await import(`../blocks/${props.name}/defaultStructure.json`)};

defaultStructure.settings = {
	...defaultStructure.settings,
	...defaultSettings
};

defaultStructure.settingGroups = {
	...defaultGroups,
};

const previewMode = ref(false);
previewMode.value = !props.editMode;

const {
	blockStructure,
	setBlockStructure,
} = blocks(defaultStructure, props.structure, props.blockIndex, props.editMode);

setBlockStructure();

watch(() => props.structure, (newValue) => { // TODO костылИЩЕ! Спасает от ситуации когда меняешь местами два одинаковых блока
	setBlockStructure();
}, { deep: true });
</script>

<template>
	<div
			:class="[
				'th-block relative',
				name,
				blockStructure.settings.overflow.value,
				blockStructure.settings.marginTop.value,
				blockStructure.settings.marginRight.value,
				blockStructure.settings.marginBottom.value,
				blockStructure.settings.marginLeft.value,
				blockStructure.settings.paddinTop.value,
				blockStructure.settings.paddinRight.value,
				blockStructure.settings.paddinBottom.value,
				blockStructure.settings.paddinLeft.value,
				blockStructure.settings.classes.value,
			]"
	>
		<font-awesome-icon
				v-if="editMode"
				:icon="['fas', 'circle-plus']"
				class="up-add-block"
				@click="emit('addBlock', {position: 'top', index: blockIndex})"
		/>
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
				:previewMode="previewMode"
				@setPreviewMode="previewMode = !previewMode"
		/>
		<component
				v-if="blockStructure"
				:is="getBlock(name)"
				:blockIndex="blockIndex"
				:blockStructure="blockStructure"
				:previewMode="previewMode"
		/>
		<font-awesome-icon
				v-if="editMode"
				:icon="['fas', 'circle-plus']"
				class="down-add-block"
				@click="emit('addBlock', {position: 'bottom', index: blockIndex})"
		/>
	</div>
</template>

<style lang="scss" scoped>
.th-block {
	> .up-add-block, > .down-add-block {
		@apply absolute hidden text-[1.4rem] cursor-pointer;
	}

	&:hover {
		> .up-add-block {
			@apply block;
		}
	}

	> .up-add-block {
		@apply top-0;
		left: calc(50% - 0.7rem);
	}

	&:hover {
		> .down-add-block {
			@apply block;
		}
	}

	> .down-add-block {
		@apply bottom-0;
		left: calc(50% - 0.7rem);
	}
}
</style>
