<script setup>
import LoadingBar from '@/components/ui/LoadingBar.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(['updateTimerList']);

import { ref, computed, onBeforeUnmount, onMounted } from 'vue'

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody, publicUrl } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error, choiceAlert } = notifications();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const { setLog } = boardGameLog();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	userId: {
		type: Number,
		default: null,
	},
	timer: {
		type: Object,
		default: {},
	},
	showName: {
		type: Boolean,
		default: true,
	},
	showControlButtons: {
		type: Boolean,
		default: true,
	},
});

const slug = ref('main');
const limit = ref(null);

if (Object.keys(props.timer)) {
	if (props.timer.slug) slug.value = props.timer.slug;
	if (props.timer.limit) limit.value = props.timer.limit;
}

const canDelete = ref(true);

if (slug.value === 'main') {
	// limit.value = 100 * 60 * 60;
	canDelete.value = false;
}

const form = ref({});

form.value.hours = {
	name: 'Часы',
	value: null,
	type: 'number',
	placeholder: '00',
	showTitle: false,
	validateRules: 'minNumber_0, maxNumber_999',
	classes: 'w-[5rem] text-[2.5rem] p-0',
};

form.value.minuts = {
	name: 'Минуты',
	value: null,
	type: 'number',
	placeholder: '00',
	showTitle: false,
	validateRules: 'minNumber_0, maxNumber_60',
	classes: 'w-[5rem] text-[2.5rem] p-0',
};

form.value.seconds = {
	name: 'Секунды',
	value: null,
	type: 'number',
	placeholder: '00',
	showTitle: false,
	validateRules: 'minNumber_0, maxNumber_60',
	classes: 'w-[5rem] text-[2.5rem] p-0',
};

const seconds = ref(0);

const formattedTime = computed(() => {
	const hours = Math.floor(seconds.value / 3600)
	const minutes = Math.floor((seconds.value % 3600) / 60)
	const secs = seconds.value % 60

	return [
		hours.toString().padStart(2, '0'),
		minutes.toString().padStart(2, '0'),
		secs.toString().padStart(2, '0')
	].join(':');
})

onBeforeUnmount(() => {
	clearInterval(timerInterval.value);
	timerInterval.value = null;
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
		body.slug = slug.value;

		if (props.userId) {
			body.user_id = props.userId;
		}

		const response = await sendApiRequest(`board-game/timer/status`, 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				if (response.time) {
					seconds.value = response.time;
				}

				if (response.limit) {
					limit.value = response.limit;
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

const toggleTimer = (value = null) => {
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
		body.slug = slug.value;

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

			if (type === 'stop') {
				if (response.error) {
					error(response.error);
				} else {
					isRunning.value = false;
					clearInterval(timerInterval.value);
					timerInterval.value = null;

					alert('Таймер остановлен');
				}
			}

			if (response.time) {
				seconds.value = response.time;
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
	if (limit.value) {
		const onePercent = limit.value / 100;

		let currentPercent = Math.round(seconds.value / onePercent);

		return currentPercent;
	}
});

const editTimeMode = ref(false);

const toggleEditTimeMode = (secondsValue = null) => {
	if (isRunning.value) {
		timerApiRequest('stop');
		isRunning.value = false;
	}

	if (editTimeMode.value) {
		let seconds = 0;

		if (secondsValue !== null) {
			seconds = Number(secondsValue);
		} else {
				seconds = (form.value.hours.value * 60 + form.value.minuts.value) * 60 + form.value.seconds.value;
		}

		editTimeRequest(seconds);
	} else {
			form.value.hours.value = seconds.value ? Math.floor(seconds.value / 3600) : null;
			form.value.minuts.value = seconds.value ? Math.floor((seconds.value % 3600) / 60) : null;
			form.value.seconds.value = seconds.value ? seconds.value % 60 : null;
	}

	editTimeMode.value = !editTimeMode.value;
}

const cancelEditTimeMode = () => {
	editTimeMode.value = false;
}

const editTimeRequest = async (secondsValue) => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.board_game_id = props.boardGameId;
		body.seconds = secondsValue;
		body.slug = slug.value;

		const response = await sendApiRequest('board-game/timer/edit', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				seconds.value = secondsValue;
				alert('Таймер обновлен');
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

const copyObsLink = () => {
	const text = `${window.location.protocol}//${publicUrl.value}/obs/timer/?bg_id=${props.boardGameId}&user_id=${userStore.user.id}&slug=${slug.value}`;

	navigator.clipboard.writeText(text)
			.then(() => {
				alert('Ссылка для OBS скопирована в буфер обмена');
			})
			.catch(err => {
				alert('Ошибка копирования:', err);
			});
}


const deleteTimerAsk = () => {
	choiceAlert(
			{
				title: 'Удалить таймер',
				message: `Удалить таймер "${props.timer.name}"?`,
				buttons: [
					{
						name: 'Да',
						func: () => {
							deleteTimer();
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
}

const deleteTimer = async () => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.board_game_id = props.boardGameId;
		body.slug = slug.value;

		const response = await sendApiRequest('board-game/timer/delete', 'DELETE', body);

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				alert('Таймер удален');
				emit('updateTimerList');
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

const formattedLimitTime = computed(() => {
	const hours = limit.value ? Math.floor(limit.value / 3600) : '00';
	const minutes = limit.value ? Math.floor((limit.value % 3600) / 60) : '00';
	const secs = limit.value ? limit.value % 60 : '00';

	return [
		hours.toString().padStart(2, '0'),
		minutes.toString().padStart(2, '0'),
		secs.toString().padStart(2, '0')
	].join(':');
})
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<div v-else class="timer-container">
		<span
				v-if="showName"
				class="user-interface-title"
		>
			{{ timer && timer.name ? timer.name : 'Таймер' }}
		</span>
		<div
				class="time-display"
				v-if="editTimeMode"
		>
			<div class="flex justify-center items-center gap-2">
				<FormGenerator
						name="hours"
						:element="form.hours"
						:showTitle="form.hours.showTitle"
						validateErrorPosition="bottom"
						labelClasses=""
						:fieldClasses="form.hours.classes"
				/>

				<FormGenerator
						name="minuts"
						:element="form.minuts"
						:showTitle="form.minuts.showTitle"
						validateErrorPosition="bottom"
						labelClasses=""
						:fieldClasses="form.minuts.classes"
				/>

				<FormGenerator
						name="seconds"
						:element="form.seconds"
						:showTitle="form.seconds.showTitle"
						validateErrorPosition="bottom"
						labelClasses=""
						:fieldClasses="form.seconds.classes"
				/>
			</div>
<!--			<input-->
<!--					v-model="editedTime"-->
<!--			>-->
		</div>
		<div v-else class="time-display">{{ formattedTime }}</div>
		<template v-if="limit">
			<span class="block mb-[0.5rem]">Лимит времени: {{ formattedLimitTime }}</span>
			<LoadingBar
					class="mb-[1rem]"
					:currentPercent="progress"
			/>
		</template>
		<template v-if="showControlButtons">
			<div class="flex gap-2" v-if="!editTimeMode">
				<layout-buttons-ActionButton
						buttonClasses="btn btn-simple-1 w-full"
						:buttonName="isRunning ? 'Стоп' : 'Старт'"
						:actionInProgress="requestInProgress"
						@startAction="toggleTimer()"
				/>
				<layout-buttons-ActionButton
						buttonClasses="btn btn-simple-1 w-full"
						buttonName="Изменить"
						:actionInProgress="requestInProgress"
						@startAction="toggleEditTimeMode()"
				/>
			</div>
			<div v-else>
				<div class="flex gap-2">
					<layout-buttons-ActionButton
							buttonClasses="btn btn-simple-1 w-full"
							buttonName="Сохранить"
							:actionInProgress="requestInProgress"
							@startAction="toggleEditTimeMode()"
					/>
					<layout-buttons-ActionButton
							buttonClasses="btn btn-simple-1 w-full"
							buttonName="Сбросить"
							:actionInProgress="requestInProgress"
							@startAction="toggleEditTimeMode(0)"
					/>
				</div>
				<div>
					<layout-buttons-ActionButton
							buttonClasses="btn btn-simple-1 w-full"
							buttonName="Отменить"
							:actionInProgress="requestInProgress"
							@startAction="cancelEditTimeMode()"
					/>
				</div>
			</div>
			<div class="flex gap-2">
				<button
						@click="copyObsLink()"
						class="btn btn-simple-1 w-full"
				>
					Скопировать OBS ссылку
				</button>
				<button
						v-if="canDelete"
						@click="deleteTimerAsk()"
						class="btn btn-simple-1 w-full"
				>
					Удалить
				</button>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.timer-container {
	@apply text-center;

	.time-display {
		@apply text-[3rem] mb-[1rem];

		input {
			@apply w-full text-center bg-[var(--second-bg-color)];
		}
	}
}
</style>
