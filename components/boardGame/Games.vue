<script setup>
import Modal from '@/components/modals/Modal.vue';
import EventGameList from '@/components/boardGame/game/EventGameList.vue';
import BigPreloader from '@/components/ui/BigPreloader.vue';

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
			Игры <font-awesome-icon :icon="['fas', 'gamepad']" />
		</button>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Игры</h3>
			<div class="link-parent-box">
				<BigPreloader v-if="modalLoading" />
				<EventGameList
						v-show="!modalLoading"
						:boardGameId="props.boardGameId"
						@loadingToggle="modalLoading = !modalLoading"
				/>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>

</style>
