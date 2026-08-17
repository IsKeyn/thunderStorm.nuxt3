<script setup>
import { ref, watch } from 'vue';

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

const flippedCards = ref([false, false, false, false, false, false, false, false, false]);
const result = ref({});

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

const gameStatus = ref(0);
const gameFinished = ref(false);

const setStateData = (data) => {
	if (data.result) {
		data.result.forEach((item) => {
			flippedCards.value[item.index] = true;
			result.value[item.index] = item.hit;
		});

		if (typeof data?.status === 'number') {
			gameStatus.value = data.status;

			if (gameStatus.value !== 0) {
				setTimeout(() => {
					gameFinished.value = true;
				}, 10000);
			}
		}
	}
}

watch(() => requestData.value, () => {
	if (requestData.value && requestData.value?.state?.result) {
		setStateData(requestData.value.state);
	}
}, { immediate: true });

const flippedCardIndex = ref(null);

const flipCard = async (index) => {
	if (requestInProgress.value || gameStatus.value !== 0) return;

	flippedCardIndex.value = index;

	if (flippedCards.value[index] === true) return;

	flippedCards.value[index] = !flippedCards.value[index];

	await choiceCardRequest(index);

	flippedCardIndex.value = null;
};

const resultMessage = ref('');

const choiceCardRequest = async (index) => {
	try {
		requestInProgress.value = true;

		const body = {
			id: props.element.id,
			slug: route.params.slug,
			// type: 'activate-effect',
			cardIndex: index,
		}

		const response = await sendApiRequest('board-game/v2/boardStatusEffect/use', 'POST', body, 'bg_usePositionEffect', 'small', 'method');

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
			if (response[userStore.player.id].message) {
				resultMessage.value = response[userStore.player.id].message.replace('*value', response[userStore.player.id].value);
			}

			setStateData(response[userStore.player.id]);
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
</script>

<template>
	<div class="flex justify-center items-center">
		<div :class="['card-wrapper', gameFinished ? 'game-over' : '']">
			<div
					v-for="(flipped, index) in flippedCards"
					:key="index"
					class="entertainment-card"
					:class="{ 'is-flipped': flipped }"
					@click="flipCard(index)"
			>
				<div class="card-inner">
					<!-- Рубашка карты -->
					<div class="card-front">
						<img src="/images/board-games/games/card_back.jpg" alt="Рубашка карты">
					</div>

					<!-- Лицо карты с текстом -->
					<div class="card-back">
						<!-- Фоновое изображение -->
						<img src="/images/board-games/games/card_front.jpg" alt="Лицо карты" class="card-bg">

						<!-- Блок с текстом поверх изображения -->
						<div class="card-content">
							<ui-BigPreloader
									v-if="requestInProgress && flippedCardIndex === index"
									class="h-full"
									theme="image"
									:themeType="9"
							/>
							<div v-else>
								<span v-if="result[index]">
									<img src="/images/board-games/games/three-of-nine/emerald.png" alt="Изумруд">
								</span>
								<span v-else>
									<img src="/images/board-games/games/three-of-nine/rubin.png" alt="Рубин">
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<style lang="scss" scoped>
.image-box {
	@apply
		relative
		flex justify-center items-center
		h-[300px]
		overflow-hidden
	;

	.article-image {
		@apply w-full h-full object-cover object-top;
		object-position: 50% -195px;

		@media (max-width: 1700px) {
			object-position: 100% -10px;
		}
	}

	.quote-box {
		@apply
			absolute
			top-[10px] md:top-[30%] lg:top-1/2 lg:-translate-y-1/2 left-0 lg:left-1/4 lg:-translate-x-1/2
			bg-[var(--body-bg-color)] text-[var(--main-dark-text-color)] p-[1rem] text-[1rem] lg:text-[1.1rem] min-[1700px]:text-[1.5rem]
			max-w-full lg:max-w-[45%] cursor-pointer
			text-wrap
			break-words
			opacity-80
		;

		span {
			@apply opacity-100;
		}
	}
}

.card-wrapper {
	@apply grid grid-cols-12 gap-5 w-[45rem] my-8;

	&.game-over {
		filter: grayscale(100%);
	}

	.entertainment-card {
		@apply col-span-4 relative cursor-pointer
			h-[10rem] w-[100px]
			sm:h-[14rem] sm:w-[140px]
			md:h-[16rem] md:w-[160px]
			lg:h-[18rem] md:w-[180px]
			xl:h-[20rem] xl:w-[206px]
		;
		perspective: 1000px;

		.card-inner {
			@apply relative w-full h-full;
			transition: transform 0.6s ease;
			transform-style: preserve-3d;
		}

		&.is-flipped .card-inner {
			transform: rotateY(180deg);
		}

		.card-front,
		.card-back {
			@apply absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg;
			backface-visibility: hidden;
		}

		.card-front {
			@apply flex items-center justify-center;

			img {
				@apply w-full h-full object-cover;
			}
		}

		.card-back {
			transform: rotateY(180deg);
			@apply flex flex-col items-center justify-center p-4 text-center;

			/* Фоновая картинка, растянутая на весь блок */
			.card-bg {
				@apply absolute inset-0 w-full h-full object-cover z-0;
			}

			/* Текстовый блок поверх картинки */
			.card-content {
				@apply relative z-10 p-4 text-black;

				.card-description {
					@apply text-[0.6rem] md:text-[0.9rem] leading-relaxed ;
				}
			}
		}

		&:hover .card-inner {
			transform: scale(1.04) translateY(-5px);
		}

		&.is-flipped:hover .card-inner {
			transform: rotateY(180deg) scale(1.04) translateY(-5px);
		}
	}
}
</style>
