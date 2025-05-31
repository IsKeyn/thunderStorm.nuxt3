<script setup>
import LoadingBar from '@/components/ui/LoadingBar.vue';

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const { setLog } = boardGameLog();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	limit: {
		type: Number,
		default: 100,
	},
});

import {ref, computed, onBeforeUnmount, onMounted} from 'vue'

const seconds = ref(0)

let timer = null

const formattedTime = computed(() => {
	const hours = Math.floor(seconds.value / 3600)
	const minutes = Math.floor((seconds.value % 3600) / 60)
	const secs = seconds.value % 60

	return [
		hours.toString().padStart(2, '0'),
		minutes.toString().padStart(2, '0'),
		secs.toString().padStart(2, '0')
	].join(':')
})


const resetTimer = () => {
	stopTimer()
	seconds.value = 0
}

onBeforeUnmount(() => {
	clearInterval(timer)
})




const requestInProgress = ref(false);

onMounted(() => {
	getTimerStatus();
});

const getTimerStatus = async () => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.board_game_id = props.boardGameId;

		const response = await sendApiRequest(`board-game/timer/status`, 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				if (response.time) {
					seconds.value = response.time;
				}

				if (response.active) {
					isRunning.value = true;

					if (!timerInterval.value) {
						timerInterval.value = setInterval(() => {
							seconds.value++
						}, 1000);
					}
				}
			}
		} else {
			error('Произошла ошибка');
			requestInProgress.value = false;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const isRunning = ref(false);
const timerInterval = ref(null);

const toggleTimer = () => {
	if (!isRunning.value) {
		timerApiRequest('start');
	} else {
		timerApiRequest('stop');
	}
}

const timerApiRequest = async (type = 'start') => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.board_game_id = props.boardGameId;

		const response = await sendApiRequest(`board-game/timer/${type}`, 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (type === 'start') {
				if (response.error) {
					error(response.error);
				} else {
					isRunning.value = true;
					timerInterval.value = setInterval(() => {
						seconds.value++
					}, 1000);

					alert('Таймер запущен');
				}
			}

			if (type === 'start') {
				if (response.error) {
					error(response.error);
				} else {
					isRunning.value = false;
					clearInterval(timerInterval.value);

					alert('Таймер остановлен');
				}
			}

			// emit('fetchLogs');
		} else {
			error('Произошла ошибка');
			requestInProgress.value = false;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const progress = computed(() => {
	const secondLimit = props.limit * 60 * 60;
	const onePercent = secondLimit / 100;

	let currentPercent = Math.round(seconds.value / onePercent);

	return currentPercent;
});
</script>

<template>
	<div class="timer-container">
		<h1>Таймер</h1>
		<div class="time-display">{{ formattedTime }}</div>
		<LoadingBar class="mb-[1rem]" :currentPercent="progress" />

		<layout-buttons-ActionButton
				buttonClasses="btn btn-simple-1 w-1/2"
				:buttonName="isRunning ? 'Стоп' : 'Старт'"
				:actionInProgress="requestInProgress"
				@startAction="toggleTimer()"
		/>
	</div>
</template>

<style lang="scss" scoped>
.time {

}

.timer-container {
	text-align: center;
	margin-top: 50px;
	font-family: Arial, sans-serif;
}

.time-display {
	font-size: 3em;
	margin: 20px 0;
}

button {
	padding: 10px 20px;
	margin: 0 5px;
	font-size: 1em;
	cursor: pointer;
	border: none;
	border-radius: 5px;
	background-color: #42b983;
	color: white;
}

button:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
}

button:not(:disabled):hover {
	background-color: #369f6b;
}
</style>
