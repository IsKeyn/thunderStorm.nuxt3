<script setup>
import Modal from '@/components/modals/Modal.vue';
import BlocksList from '@/components/blockEditor/editor/BlocksList.vue';
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

import { blocks } from '@/composables/blocks.js'
const { blockList } = blocks();

// Работа с модальным окном
const blocksModal = ref(false);

const blockPosition = ref('endOfList');
const blockIndex = ref(null);

const addBlock = (params = {position: 'endOfList', index: null}) => {
	blockPosition.value = params.position;
	blockIndex.value = params.index;

	toggleBlocksModal();
}

const toggleBlocksModal = () => {
	blocksModal.value = !blocksModal.value;
}

const selectBlock = (element) => {
	toggleBlocksModal();
		pageBlocks.addBlockWithPosition(
			{
				name: element,
				structure: {},
			},
			blockPosition.value,
			blockIndex.value
		);
}

defineExpose({
	addBlock,
});
</script>

<template>
	<div>
		<button
				class="btn btn-primary"
				@click="addBlock()"
		>
			Добавить блок
		</button>

		<Modal
				:showOpenModal="blocksModal"
				size="full-width"
				modal-id="blocks-list-modal"
				@toggleModal="toggleBlocksModal"
		>
			<BlocksList @selectBlock="selectBlock" />
		</Modal>

		<BlockWrapper
				v-for="(block, blockIndex) in pageBlocks.blocks"
				:name="block.name"
				:structure="block.structure"
				:blockIndex="blockIndex"
				:editMode="true"
				@addBlock="addBlock($event)"
		/>
	</div>
</template>

