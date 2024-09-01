<script setup>
import FixedControlPanel from '@/components/ui/FixedControlPanel.vue';
import SettingByType from '@/components/blocks/extensions/fragments/SettingByType.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';

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

const showPanel = ref(false);

const togglePanel = () => {
	showPanel.value = !showPanel.value;
}

const changePosition = (direction) => {
	pageBlocks.changePositionByIndexId(direction, props.blockIndex);
}

const setSettingsGroups = () => { // TODO переписать, не читаемо
	if (pageBlocks.blocks[props.blockIndex].structure.settings) {
		for (let key in pageBlocks.blocks[props.blockIndex].structure.settings) {
			if (pageBlocks.blocks[props.blockIndex].structure.settings[key].group) {
				const groupName = pageBlocks.blocks[props.blockIndex].structure.settings[key].group;

				if (pageBlocks.blocks[props.blockIndex].structure.settingGroups[groupName]) {
					if (!pageBlocks.blocks[props.blockIndex].structure.settingGroups[groupName].settingsKeys) {
						pageBlocks.blocks[props.blockIndex].structure.settingGroups[groupName].settingsKeys = [];
					}

					if (!pageBlocks.blocks[props.blockIndex].structure.settingGroups[groupName].settingsKeys.includes(key)) {
						pageBlocks.blocks[props.blockIndex].structure.settingGroups[groupName].settingsKeys.push(key);
					}
				}
			}
		}
	}
};

setSettingsGroups();
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
				@click="togglePanel"
		>
			<font-awesome-icon :icon="['fas', 'sliders']" />
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
	<FixedControlPanel
		:showPanel="showPanel"
		title="Настройки блока"
		@togglePanel="togglePanel"
	>
		<div v-if="pageBlocks.blocks[blockIndex].structure.settings">
			<div
					v-for="(setting, key) in pageBlocks.blocks[blockIndex].structure.settings"
					:key="key"
					:class="[
							'mb-2 text-left'
					]"
			>
				<template v-if="!setting.group">
					<SettingByType :setting="setting" />
				</template>
			</div>

			<div v-for="(group, key) in pageBlocks.blocks[blockIndex].structure.settingGroups">
				<OpeningBox
						:title="group.name"
						classes="mb-1"
				>
					<div v-for="(settingKey, key1) in group.settingsKeys">
						<SettingByType :setting="pageBlocks.blocks[blockIndex].structure.settings[settingKey]" />
					</div>
				</OpeningBox>
			</div>
		</div>
	</FixedControlPanel>
</template>

<style lang="scss" scoped>
.btn {
	@apply ml-1;
}
</style>
