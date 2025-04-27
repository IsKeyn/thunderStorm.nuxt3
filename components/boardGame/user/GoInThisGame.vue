<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const {
	sendApiRequest,
} = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { ref } from "vue";

const emit = defineEmits(['updateBoardGameInfo']);

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

const requestInProgress = ref(false);

const goIn = async () => {
	requestInProgress.value = true;

	try {
		const body = {
			board_game_id: props.boardGameId,
		}

		const response = await sendApiRequest('board-game/player/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			emit('updateBoardGameInfo');

			alert(`Теперь вы участвуюте в игре ${props.boardGameInfo.name}`);
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="text-center">
		<button class="btn btn-primary" @click="goIn()">Участвовать в этой игре</button>
	</div>
</template>
