<script setup>
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
</script>

<template>
	<div class="control-panel">
		<button class="btn"><font-awesome-icon :icon="['fas', 'angle-up']" /></button>
			<button class="btn"><font-awesome-icon :icon="['fas', 'angle-down']" /></button>
		<button class="btn" @click="deleteBlock"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
	</div>
</template>
