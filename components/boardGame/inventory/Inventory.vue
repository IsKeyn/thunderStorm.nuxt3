<script setup>
import Modal from '@/components/modals/Modal.vue';
import InventoryInterface from '@/components/boardGame/Inventory/InventoryInterface.vue';

const emit = defineEmits(['fetchLogs']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const modalOpen = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
};
</script>

<template>
	<div class="text-center">
		<button
				class="btn btn-primary"
				@click="openCloseModalFunc"
		>
			Открыть инвентарь
		</button>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Инвентарь</h3>
			<div class="link-parent-box">
				<InventoryInterface
						:boardGameId="boardGameId"
						@fetchLogs="emit('fetchLogs')"
				/>
			</div>
		</div>
	</Modal>
</template>
