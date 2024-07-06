<script setup>
import Modal from '@/components/modals/Modal.vue';
import BlocksList from '@/components/blocks/BlocksList.vue';

import { watch } from "vue";
const emit = defineEmits(['update:modelValue']);

import { blocks } from '@/composables/blocks.js'
const {
	getBlock,
	blockList,
} = blocks();

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
});

// Работа с модальным окном
const blocksModal = ref(false);

const toggleBlocksModal = () => {
	blocksModal.value = !blocksModal.value;
}

const pageBlocks = ref([]);
const hasFirstLoad = ref(false);

pageBlocks.value = toRaw(props.modelValue);

watch(() => props.modelValue, (newValue) => {
	if (!hasFirstLoad.value) {
		pageBlocks.value = toRaw(newValue);
		hasFirstLoad.value = true;
	}
}, { deep: true });

watch(() => pageBlocks, (newValue) => {
	emit('update:modelValue', toRaw(newValue.value));
}, { deep: true });

const selectBlock = (element) => {
	toggleBlocksModal();

	pageBlocks.value.push(
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
				class="btn"
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
				v-for="block in pageBlocks"
				:is="getBlock(block.name)"
				v-model="block.structure"
				:editMode="true"
		/>
	</div>
</template>

