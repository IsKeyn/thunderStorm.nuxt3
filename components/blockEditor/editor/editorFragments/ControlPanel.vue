<script setup>
import FixedControlPanelWithSettings from '@/components/blockEditor/editor/editorFragments/FixedControlPanelWithSettings.vue';

const emit = defineEmits(['setPreviewMode']);

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

const props = defineProps({
	blockIndex: {
		type: Number,
		default: null,
	},
	alwaysShow: {
		type: Boolean,
		default: false,
	},
	previewMode: {
		type: Boolean,
		default: false,
	}
});

const deleteBlock = () => {
	pageBlocks.deleteBlockByIndex(props.blockIndex);
}

const changePosition = (direction) => {
	pageBlocks.changePositionByIndexId(direction, props.blockIndex);
}

const copyBlock = () => {
	pageBlocks.copyBlock(props.blockIndex);
}

const setSettingsGroups = () => {
	/* Распределение настроек по группам */
	const settings = pageBlocks.blocks[props.blockIndex].structure.settings;
	const settingGroups = pageBlocks.blocks[props.blockIndex].structure.settingGroups;

	if (settings) {
		for (let key in settings) {
			if (settings[key].group) {
				const groupName = settings[key].group;

				if (settingGroups[groupName]) {
					if (!settingGroups[groupName].settingsKeys) {
						settingGroups[groupName].settingsKeys = [];
					}

					if (!settingGroups[groupName].settingsKeys.includes(key)) {
						settingGroups[groupName].settingsKeys.push(key);
					}
				}
			}
		}
	}
};

setSettingsGroups();

const fixedControlPanelWithSettingsRef = ref(null);
</script>

<template>
	<div :class="['control-panel', alwaysShow ? '!block' : '', 'z-10']">
		<button
				class="btn btn-simple"
				title="Просмотреть блок блока"
				@click="$emit('setPreviewMode')"
		>
			<font-awesome-icon v-if='previewMode' :icon="['fas', 'eye-slash']" />
			<font-awesome-icon v-else :icon="['fas', 'eye']" />
		</button>
		<button
				class="btn btn-simple"
				title="Настройки блока"
				@click="fixedControlPanelWithSettingsRef.togglePanel()"
		>
			<font-awesome-icon :icon="['fas', 'sliders']" />
		</button>
		<button
				class="btn btn-simple"
				title="Копировать блок"
				@click="copyBlock"
		>
			<font-awesome-icon :icon="['fas', 'copy']" />
		</button>
		<button
				class="btn btn-simple"
				title="Переместить вверх"
				@click="changePosition('top')"
		>
			<font-awesome-icon :icon="['fas', 'angle-up']" />
		</button>
		<button
				class="btn btn-simple"
				title="Переместить вниз"
				@click="changePosition('bottom')"
		>
			<font-awesome-icon :icon="['fas', 'angle-down']" />
		</button>
		<button
				class="btn btn-simple"
				title="Удалить блок"
				@click="deleteBlock"
		>
			<font-awesome-icon :icon="['fas', 'xmark']" />
		</button>
	</div>

	<FixedControlPanelWithSettings
			ref="fixedControlPanelWithSettingsRef"
			:title="`Настройки блока ${pageBlocks.blocks[blockIndex].name} [${blockIndex}]`"
			:settings="pageBlocks.blocks[blockIndex].structure.settings"
			:settingGroups="pageBlocks.blocks[blockIndex].structure.settingGroups"
	/>
</template>

<style lang="scss" scoped>
.btn {
	@apply ml-1;
}
</style>
