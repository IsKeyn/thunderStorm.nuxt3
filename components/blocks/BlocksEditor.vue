<script setup>
import Modal from '@/components/modals/Modal.vue';
import BlocksList from '@/components/blocks/BlocksList.vue';

import { watch } from "vue";

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

import { blocks } from '@/composables/blocks.js'
const {
	getBlock,
	blockList,
} = blocks();


// Работа с модальным окном
const blocksModal = ref(false);

const toggleBlocksModal = () => {
	blocksModal.value = !blocksModal.value;
}

const hasFirstLoad = ref(false);

const selectBlock = (element) => {
	toggleBlocksModal();

	pageBlocks.blocks.push(
			{
				name: element,
				structure: {},
			},
	);
}
</script>

<template>
	<div>
		<button
				class="btn btn-primary"
				@click="toggleBlocksModal()"
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

		<component
				v-for="(block, blockIndex) in pageBlocks.blocks"
				:is="getBlock(block.name)"
				:blockIndex="blockIndex"
				:editMode="true"
		/>
	</div>
</template>

