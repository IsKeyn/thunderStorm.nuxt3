<script setup>
import Modal from '@/components/modals/Modal.vue';
import BigPreloader from '@/components/ui/BigPreloader.vue';
import StatsList from '@/components/boardGame/stats/StatsList.vue';

const emit = defineEmits(['showPlayer']);

const modalOpen = ref(false);
const modalLoading = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
	modalLoading.value = true;
};

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const loadingToggle = (value) => {
	modalLoading.value = value;
}

defineExpose({
	openCloseModalFunc,
});
</script>

<template>
	<div class="text-center">
		<ui-IconButton
				class="ml-[1rem]"
				:faIcon="['fas', 'chart-pie']"
				buttonText="Статистика"
				@click="openCloseModalFunc"
		/>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Статистика (обновляется раз в 24 часа)</h3>
			<div class="link-parent-box">
				<BigPreloader v-if="modalLoading" />
				<StatsList
						v-show="!modalLoading"
						:boardGameId="boardGameId"
						:boardGameInfo="boardGameInfo"
						@loadingToggle="loadingToggle($event)"
						@showPlayer="$emit('showPlayer', $event)"
				/>
			</div>
		</div>
	</Modal>
</template>
