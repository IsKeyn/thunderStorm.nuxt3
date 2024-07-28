<script setup>
import FixedControlPanel from '@/components/ui/FixedControlPanel.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

const props = defineProps({
	blockIndex: {
		type: Number,
		default: null,
	},
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
</script>

<template>
	<div class="control-panel">
		<button
				class="btn btn-simple"
				title="Настройки блока"
				@click="togglePanel"
		>
			<font-awesome-icon :icon="['fas', 'sliders']" />
		</button>
		<button
				class="btn btn-simple"
				@click="changePosition('top')"
		>
			<font-awesome-icon :icon="['fas', 'angle-up']" />
		</button>
		<button
				class="btn btn-simple"
				@click="changePosition('bottom')"
		>
			<font-awesome-icon :icon="['fas', 'angle-down']" />
		</button>
		<button class="btn btn-simple" @click="deleteBlock"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
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
			>
				<div v-if="setting.type === 'checkbox' || setting.type === 'text'">
					<FormGenerator
							:name="setting.name"
							:element="setting"
							:showTitle="false"
							validateErrorPosition="bottom"
							fieldClasses="w-full"
					/>
				</div>
				<div v-if="setting.type === 'select'">
					<FormGenerator
							:name="setting.name"
							:element="setting"
							:showTitle="false"
							validateErrorPosition="bottom"
							fieldClasses="w-full"
					/>
				</div>
			</div>
		</div>
	</FixedControlPanel>
</template>

<style lang="scss" scoped>
.btn {
	@apply ml-1;
}
</style>
