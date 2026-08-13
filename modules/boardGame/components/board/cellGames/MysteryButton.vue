<script setup>
import { computed, ref } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { choiceAlert, error, alert } = notifications();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
});

const gameIsFinished = ref(false);

// Смена кнопка при наведении и нажатии
const isHovered = ref(false);
const isPressed = ref(false);

const imageNumber = computed(() => {
	if (isPressed.value) return 2;
	if (isHovered.value) return 2;
	return 1;
});

const imagePath = computed(
		() => `/images/board-games/games/mystery-button/${imageNumber.value}.png`
);

const onMouseEnter = () => {
	isHovered.value = true;
}

const onMouseLeave = () => {
	isHovered.value = false;
	isPressed.value = false;
}

// function onMouseDown() {
// 	isPressed.value = true;
// }
//
// function onMouseUp() {
// 	isPressed.value = false;
// }

const onMouseClick = () => {
	if (gameIsFinished.value === true) {
		alert('Игра звершена');
		return;
	}

	buttonRequest();
}

// Получение State
const requestName = 'MysteryButtonGetState';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (!userStore.player.id) {
				return false;
			}

			const body = {
				playerId: userStore.player.id,
				entityType: 'App\\Models\\BoardGame\\BoardGamePlayerPosition',
			};

			const response = await Promise.resolve(
					sendApiRequest(`save-state/get-by-bg-player/`, 'GET', body, 'MysteryButtonGetState', '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

// Активация кнопки
const resultMessage = ref('');

const buttonRequest = async () => {
	try {
		requestInProgress.value = true;

		const body = {
			id: props.element.id,
			slug: route.params.slug,
			element: props.element,
		}

		const response = await sendApiRequest(
				'board-game/v2/boardStatusEffect/use',
				'POST',
				body,
				'bg_usePositionEffect',
				'fullscreenTransparent',
				'method'
		);

		requestInProgress.value = false;

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		if (response[userStore.player.id]) {
			resultMessage.value = response[userStore.player.id].message.replace('*value', response[userStore.player.id].value);

			if (response[userStore.player.id]?.gameFinished === true) {
				gameIsFinished.value = true;
			}
		}

		if (resultMessage) {
			alert(resultMessage.value, 10000);

			if (!hasWebSocked()) refreshLayoutData();
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const historyMessage = computed(() => {
	if (
			fetchedData.value?.state?.currentState
			&& userStore.player.id
			&& fetchedData.value?.state?.result?.[fetchedData.value.state.currentState]?.[userStore.player.id]?.value
			&& fetchedData.value?.state?.result?.[fetchedData.value.state.currentState]?.[userStore.player.id]?.message
	) {
		const value = fetchedData.value.state.result[fetchedData.value.state.currentState][userStore.player.id].value;
		const message = fetchedData.value.state.result[fetchedData.value.state.currentState][userStore.player.id].message;

		return message.replace('*value', value);
	}
});
</script>

<template>
	<div
			:class="['button-block', `${gameIsFinished ? 'game-is-finished' : ''}`]"
	>
		<img
				@mouseenter="onMouseEnter"
				@mouseleave="onMouseLeave"
				@mousedown="onMouseDown"
				@mouseup="onMouseUp"
				@click="onMouseClick"
				:key="imagePath"
				:src="imagePath"
				class="article-image"
				alt="Mystery button"
		>
		<div
				class="background-block"
				:style="`
					background-image: url('/images/board-games/games/mystery-button/background.png');
					background-size: cover;
					background-position: center;
					background-repeat: no-repeat;
				`"
		>
			<span class="block">{{ resultMessage ? resultMessage : (historyMessage ? historyMessage : 'Результат') }}</span>
			<span v-if="gameIsFinished" class="block">
				Игра завершена
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.button-block {
	@apply mx-auto block lg:flex items-center justify-center;

	&.game-is-finished {
		.article-image {
			filter: grayscale(100%);
		}

		.background-block {
			filter: grayscale(100%);
		}
	}

	.article-image {
		@apply
			block mx-auto lg:mx-0
			max-w-[100%] h-full
			cursor-pointer
		;
	}

	.background-block {
		@apply
			mx-auto lg:mx-0 flex items-center justify-center flex-col
			min-h-[15rem] min-w-[20rem]
			text-[2rem]
		;
	}
}
</style>
