<script setup>
import Modal from '@/components/modals/Modal.vue';
import ItemsList from '@/components/boardGame/inventory/ItemsList.vue';

import { ref } from "vue";

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const modalOpen = ref(false);
const modalLoading = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
	modalLoading.value = true;
};
</script>

<template>
	<div class="text-center">
		<button
				class="btn btn-simple-1 ml-[1rem]"
				@click="openCloseModalFunc"
		>
			<span class="button-text">Предметы</span> <font-awesome-icon :icon="['fas', 'hat-wizard']" />
		</button>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Предметы</h3>
			<div class="link-parent-box">
				<ui-BigPreloader v-if="modalLoading" />
				<ItemsList
						v-show="!modalLoading"
						@loadingToggle="modalLoading = !modalLoading"
				/>
			</div>
		</div>
	</Modal>
</template>
