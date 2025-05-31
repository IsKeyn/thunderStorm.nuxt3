<script setup>
import Modal from '@/components/modals/Modal.vue';
import CurrentGameCard from '@/components/boardGame/game/CurrentGameCard.vue';
import GamblingGame from '@/components/boardGame/game/GamblingGame.vue';

import { ref } from "vue";

const emit = defineEmits(['updateBoardGameInfo', 'showPlayer', 'loadingToggle']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

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

const modalOpen = ref(false);
const modalLoading = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
	modalLoading.value = true;
};

const currentPlayer = computed(() => {
	let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === userStore.user.id);

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});

const loadingToggle = (value) => {
	modalLoading.value = value;
}

defineExpose({
	openCloseModalFunc,
});
</script>

<template>
	<div>
		<span class="user-interface-title">Текущая игра</span>
		<CurrentGameCard
				v-if="currentPlayer.current_game"
				:showTitle="false"
				:showInfoButtons="false"
				:currentGame="currentPlayer.current_game"
				:players="boardGameInfo.players"
				@click="openCloseModalFunc"
		/>
		<button @click="openCloseModalFunc" class="btn btn-simple-1 w-full">Профиль игры</button>
		<Modal
				:showOpenModal="modalOpen"
				size="full-width"
				:fullCloseModal="true"
				@toggleModal="openCloseModalFunc"
		>
			<div class="modal-parent">
				<h3 class="modal-title">Рулетка игр</h3>
				<div class="link-parent-box">
					<ui-BigPreloader v-if="modalLoading" />
					<GamblingGame
							v-show="!modalLoading"
							:boardGameInfo="boardGameInfo"
							@updateBoardGameInfo="emit('updateBoardGameInfo')"
							@showPlayer="$emit('showPlayer', $event)"
							@loadingToggle="loadingToggle($event)"
					/>
				</div>
			</div>
		</Modal>
	</div>
</template>
