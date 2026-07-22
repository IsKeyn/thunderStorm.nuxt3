<script setup>
import LoadingBar from '@/components/ui/LoadingBar.vue';
import AddGameForm from '@/modules/boardGame/components/game/addGameElements/AddGameForm.vue';

import { computed, ref, watch } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

import { bgPlayer } from '@/composables/boardGame/bgPlayer.js'
const { player, isActivePlayer } = bgPlayer();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const requestName = 'addGameCheck';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (isAuth.value) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/add-game/check/${route.params.slug}/`, 'GET', {}, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const checkResult = computed(() => requestData.value?.result || null);
const records = computed(() => requestData.value?.records || []);

const errorMessage = computed(() => {
	if (!isAuth) return 'Только авторизованный пользователь может добавлять игры';
	if (!isActivePlayer) return 'Вы должны быть игроком данной настольной игры, чтобы добавлять игры';

	return 'Ошибка, повторите позже';
});

const value = ref([]);

watch(() => records.value, () => {
	value.value = [ ...records.value ];
}, { deep: true });

const saveData = async () => {
	try {
		const body = {
			data: value.value,
		}

		const response = await sendApiRequest(`board-game/v2/add-game/save/${route.params.slug}`, 'POST', body, 'bg_add-game-save', 'small', 'method');

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		alert(
				response.message ? response.message : 'Сохранено',
				10000
		);

		refresh();
	} catch (e) {
		error(e);
	}
}

const submitDataForReview = async () => {
	try {
		const body = {
			data: value.value,
			submitDataForReview: true,
		}

		const response = await sendApiRequest(`board-game/v2/add-game/save/${route.params.slug}`, 'POST', body, 'bg_add-game-submit', 'small', 'method');

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		alert(
				response.message ? response.message : 'Отправлено на модерацию',
				10000
		);
	} catch (e) {
		error(e);
	}
}

const addingGamesConditions = computed(() => {
	return JSON.parse(getSettingValue('addingGamesConditions'));
});

const cantSubmitDataForReviewMessages = ref([]);

const checkDataForReview = () => {
	cantSubmitDataForReviewMessages.value = [];

	const platforms = JSON.parse(getSettingValue('eventGamePlatforms'));

	if (!platforms) return false;
	const gamePerPlatforms = {};

	platforms.forEach((item) => {
		if (item.minCountForAdd) {
			gamePerPlatforms[item.id] = item;
		}
	});

	const playerGamesPerPlatforms = {};

	if (addingGamesConditions.value.maxGames && value.value.length < addingGamesConditions.value.maxGames) {
		cantSubmitDataForReviewMessages.value.push(`Для отправки игр на рассмотрение необходимо добавить ${addingGamesConditions.value.maxGames} игр`);
	}

	value.value.forEach((item) => {
		if (item.gaming_platform_id) {
			if (playerGamesPerPlatforms[item.gaming_platform_id]) {
				playerGamesPerPlatforms[item.gaming_platform_id]++;
			} else {
				playerGamesPerPlatforms[item.gaming_platform_id] = 1;
			}
		}

		if (!item.name) {
			cantSubmitDataForReviewMessages.value.push('Поле "Наименование игры" обязательно для заполнения');
		} else {
			if (!item.gaming_platform_id) {
				cantSubmitDataForReviewMessages.value.push(`Вы не заполнили поле "Платформа игры" у игры ${item.name}`);
			}

			if (!item.game_completion_time) {
				cantSubmitDataForReviewMessages.value.push(`Вы не заполнили поле "Время прохождения (HLTB)" у игры ${item.name}`);
			}

			if (!item.difficulty) {
				cantSubmitDataForReviewMessages.value.push(`Вы не заполнили поле "Сложность игры в процентах от 0 до 100" у игры ${item.name}`);
			}
		}
	});

	for (let key in gamePerPlatforms) {
		if (gamePerPlatforms[key].minCountForAdd > playerGamesPerPlatforms[key]) {
			cantSubmitDataForReviewMessages.value.push(`Минимальное количество игр на платформе "${gamePerPlatforms[key].name}" должно быть ${gamePerPlatforms[key].minCountForAdd}`);
		}
	}
}

watch(() => value.value, () => {
	checkDataForReview();
}, { deep: true, immediate: true });
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="isAuth && checkResult">
		<template v-if="checkResult.status === 1">
			<div class="item-box">
				Правила добавления игр

				Вам необходимо выбрать {{ addingGamesConditions.maxGames }} игр
			</div>
			<AddGameForm
					v-model="value"
					:maxElements="addingGamesConditions.maxGames"
			/>
			<div
					v-if="cantSubmitDataForReviewMessages.length"
					class="item-box !p-4"
			>
				<span class="block mb-2">Вы можете сохранить свой список игр, но для отправки на модерацию для добавления вы должны решить следующие проблемы:</span>
				<ul>
					<li
							v-for="(value, key) in cantSubmitDataForReviewMessages"
							:key="key"
					>{{ value }}</li>
				</ul>
			</div>
			<div class="flex">
				<button
						class="btn btn-simple mr-2"
						@click="saveData()"
				>
					Сохранить
				</button>
				<button
						class="btn btn-simple mr-2"
						@click="submitDataForReview()"
						:disabled="cantSubmitDataForReviewMessages.length"
				>
					Отправить на рассмотрение
				</button>
			</div>

		</template>
		<div v-if="checkResult.status === 2">
			<div class="item-box !mb-[1rem]"><font-awesome-icon :icon="['fas', 'circle-info']" /> Вы можете добавить свои игры, при выполнении условий</div>
			<div class="wrapper">
				<div v-if="addingGamesConditions?.position" class="col-span-6">
					Необходимо достигнуть позиции {{ addingGamesConditions.position }} на игровом поле
					<LoadingBar
							class="mb-[1rem] col-span-6"
							theme="on-from-current"
							:fullFill="addingGamesConditions.position"
							:currentFill="checkResult?.data?.position"
					/>
				</div>

				<div v-if="addingGamesConditions?.finishedGames" class="col-span-6">
					Необходимо пройти {{ addingGamesConditions.finishedGames }} игры
					<LoadingBar
							class="mb-[1rem]"
							theme="on-from-current"
							:fullFill="addingGamesConditions.finishedGames"
							:currentFill="checkResult?.data?.finishedGames"
					/>
				</div>
			</div>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			:message="errorMessage"
	/>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply grid grid-cols-12 gap-4;
}

.item-box {
	@apply rounded-none block;

	.field {
		@apply mb-2;
	}
}
</style>
