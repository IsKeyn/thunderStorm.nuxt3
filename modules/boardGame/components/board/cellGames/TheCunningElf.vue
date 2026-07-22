<script setup>
import { ref } from 'vue';

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

const flippedCards = ref([false, false, false]);

const flipCard = (index) => {
	if (flippedCards.value.includes(true)) return;

	flippedCards.value[index] = !flippedCards.value[index];

	choiceCardRequest();
};

const requestInProgress = ref(false);
const resultMessage = ref('');

const choiceCardRequest = async () => {
	try {
		requestInProgress.value = true;

		const body = {
			id: props.element.id,
			slug: route.params.slug,
			type: 'activate-effect',
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
			resultMessage.value = response[userStore.player.id].cardMessage.replace('*value', response[userStore.player.id].value);
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
	<div class="image-box">
		<img src="/images/board-games/games/the_cunning_elf.jpg" class="article-image">
		<div class="quote-box">
			<Transition name="fade" mode="out-in">
					<span>
						Эльфийка предлагает вам выбрать одну из 3-х карт на выбор.
						Но предупреждает, что вы можете выбрать только 1 карту и эффект может быть как положительным, так и отрицательным.
						В принципе, ты можешь уйти, не переворачивая карт, но ведь любопытно, чего тебе уготовила судьба?
					</span>
			</Transition>
		</div>
	</div>

	<div class="card-wrapper">
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
								v-if="requestInProgress"
								class="h-full"
								theme="image"
								:themeType="9"
						/>
						<div v-else>
							<p class="card-description">{{ resultMessage }}</p>
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
	}

	.quote-box {
		@apply
			absolute
		top-[10px] md:top-[30%] lg:top-1/2 lg:-translate-y-1/2 left-0 lg:left-1/4 lg:-translate-x-1/2
			bg-[var(--body-bg-color)] text-[var(--main-dark-text-color)] p-[1rem] text-[1.5rem]
			max-w-[45%] cursor-pointer
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
	@apply flex justify-center items-center gap-5 w-full my-8;

	.entertainment-card {
		@apply relative cursor-pointer;
		perspective: 1000px;
		width: 206px;
		height: 20rem;

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
					@apply text-[0.9rem] leading-relaxed ;
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
