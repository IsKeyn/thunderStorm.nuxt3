<script setup>
import Modal from '@/components/modals/Modal.vue';
import EventGameList from '@/components/boardGame/game/EventGameList.vue';

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
				<EventGameList
						:boardGameId="props.boardGameId"
				/>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>

</style>
