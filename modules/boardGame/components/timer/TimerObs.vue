<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const { subscribe, unsubscribe } = useWebSocket();

const runtimeConfig = useRuntimeConfig();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const getStatusInterval = ref(null);

const props = defineProps({
	bg_slug: {
		type: String,
		default: '',
	},
	user_id: {
		type: Number,
		default: null,
	},
	slug: {
		type: String,
		default: '',
	},
});

onMounted(() => {
	getTimerStatus();

	if (runtimeConfig.public.hasWebSockedServer) {
		let channelName = 'timer';

		channelName += `.${route.query.bg_slug ?? props.bg_slug}.${route.query.user_id ?? props.user_id}.${route.query.slug ?? props.slug}`;

		const { unsubscribe: stop, subscriptionId } = subscribe(
				channelName,
				'TimerStatusToggle',
				(data) => {
					statusHandler(data);
				},
				'public'
		);
	} else {
		getStatusInterval.value = setInterval(() => {
			getTimerStatus();
		}, 7000);
	}
});

onUnmounted(() => {
	if (!runtimeConfig.public.hasWebSockedServer) {
		clearInterval(getStatusInterval.value);
	}
});

const showMessage = ref('');

const seconds = ref(0);
const timerName = ref('');
const settings = ref({
	font: 'Digital-7',
	animation: true,
	showTitle: false,
});

const isRunning = ref(null);

const timerInterval = ref(null);

const getTimerStatus = async () => {
	try {
		const body = {};

		body.boardGameSlug = route.query.bg_slug ?? props.bg_slug;
		body.user_id = route.query.user_id ?? props.user_id;
		body.slug = route.query.slug ?? props.slug;

		const response = await sendApiRequest(`board-game/timer/status`, 'POST', body);

		if (response) {
			statusHandler(response);
		} else {
			showMessage.value = 'Произошла ошибка';
		}
	} catch (e) {
		showMessage.value = e;
	}
}

const statusHandler = (data) => {
	if (data.error) {
		showMessage.value = data.error;
	} else {
		if (!route.query.hideTitle) {
			timerName.value = data.name;
		}

		if (data.settings) {
			settings.value = data.settings;
		}

		if (data.active !== isRunning.value) {
			if (typeof data.time === 'number') {
				seconds.value = data.time;
			}

			if (data.active) {
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
		} else if (typeof data.time === 'number' && (isRunning.value === false || isRunning.value === null)) {
			seconds.value = data.time;
		}
	}
}

const formattedTime = computed(() => {
	const hours = Math.floor(seconds.value / 3600)
	const minutes = Math.floor((seconds.value % 3600) / 60)
	const secs = Math.floor(seconds.value % 60);

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
				v-if="settings.showTitle === true"
				class="timer-name"
		>{{ timerName }}</span>
		<span
				:class="[
						'timer',
						isRunning ? (settings.animation === true ? 'active' : '') : '',
						route.query.font ?? settings.font
				]"
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
		@apply text-[4rem] block mt-[-1rem];
		text-shadow: 0 0 5px #000; /* Свечение */

		&.Digital-7 {
			@apply font-['Digital-7'];
		}

		&.PFCentroSansPro-Light {
			@apply font-['PFCentroSansPro-Light'];
		}

		&.PFCentroSansPro-Medium {
			@apply font-['PFCentroSansPro-Medium'];
		}

		&.Verdana {
			@apply font-['Verdana'];
		}

		&.Verdana-Bold {
			@apply font-['Verdana-Bold'];
		}

		&.Verdana-BoldItalic {
			@apply font-['Verdana-BoldItalic'];
		}

		&.Verdana-Italic {
			@apply font-['Verdana-Italic'];
		}

		&.active {
			animation: flicker 0.5s infinite alternate;
		}
	}
}
</style>
