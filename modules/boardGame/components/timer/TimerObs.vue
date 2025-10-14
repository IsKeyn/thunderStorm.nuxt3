<script setup>
import { computed, onMounted, ref } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

onMounted(() => {
	getTimerStatus();

	setInterval(() => {
		getTimerStatus();
	}, 5000);
});

const showMessage = ref('');

const seconds = ref(0);
const timerName = ref('');

const isRunning = ref(null);

const timerInterval = ref(null);

const route = useRoute();

const getTimerStatus = async () => {
	try {
		const body = {};

		body.boardGameSlug = route.query.bg_slug;
		body.user_id = route.query.user_id;
		body.slug = route.query.slug;

		const response = await sendApiRequest(`board-game/timer/status`, 'POST', body);

		if (response) {
			if (response.error) {
				showMessage.value = response.error;
			} else {
				if (!route.query.hideTitle) {
					timerName.value = response.name;
				}

				if (response.active !== isRunning.value) {
					if (typeof response.time === 'number') {
						seconds.value = response.time;
					}

					if (response.active) {
						isRunning.value = true;
						if (!timerInterval.value) {
							timerInterval.value = setInterval(() => {
								seconds.value++
							}, 1000);
						}
					} else {
						isRunning.value = false;
						clearInterval(timerInterval.value);
						timerInterval.value = null;
					}
				} else if (typeof response.time === 'number' && (isRunning.value === false || isRunning.value === null)) {
					seconds.value = response.time;
				}
			}
		} else {
			showMessage.value = 'Произошла ошибка';
		}
	} catch (e) {
		showMessage.value = e;
	}
}

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
</script>

<template>
	<div class="timer-body">
		<span
				class="timer-name"
		>{{ timerName }}</span>
		<span
				:class="['timer', isRunning ? 'active' : '']"
		>
			<template v-if="formattedTime">
				{{ formattedTime }}
			</template>
			<template v-else>
				{{ showMessage }}
			</template>
		</span>
	</div>

</template>

<style lang="scss" scoped>
@font-face {
	font-family: "Digital-7";
	src: url("/fonts/digital-7.ttf");
	font-style: normal;
	font-weight: normal;
}

@keyframes flicker {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.8; }
}

.timer-body {
	@apply text-white text-center;

	.timer-name {
		@apply block text-[1.5rem];
		text-shadow: 0 0 5px #000; /* Свечение */
	}

	.timer {
		@apply text-[4rem] font-['Digital-7'] block mt-[-1rem];
		text-shadow: 0 0 5px #000; /* Свечение */

		&.active {
			animation: flicker 0.5s infinite alternate;
		}
	}
}
</style>
