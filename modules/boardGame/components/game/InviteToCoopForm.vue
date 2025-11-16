<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import SelectPlayer from '@/modules/boardGame/components/user/player/SelectPlayer.vue';

import { computed, ref } from "vue";

const emit = defineEmits(['toggleFormVisible', 'updateData']);

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { players } from '@/composables/BoardGame/players.js';
const { getPlayersForItem } = players();

const props = defineProps({
	board_game_game_list_id: {
		type: Number,
		default: null,
	},
	game: {
		type: Object,
		default: {},
	},
	points: {
		type: Number,
		default: 0,
	},
});

const form = ref({});

form.value.comment = {
	name: 'Комментарий',
			value: 'Приглашаю тебя пройти в коопе игру ',
			type: 'textarea',
			placeholder: '',
			validateRules: 'minLength_2, maxLength_5000',
			classes: 'w-full mt-1 mb-1 resize-y',
};

if (props.game.game.name) {
	form.value.comment.value += props.game.game.name;
}

// Получение времени игры
const requestName = 'getBoardGamePlayersWithInventory';

const {
	data: requestData,
	pending: requestGetPlayersInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			let type = 'inviteToCoop';

			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player/listWithInventory/${route.params.slug}/`, 'GET', { type }, requestName, '')
			);

			return response.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedPlayers = computed(() => requestData.value || null);

const selectedPlayer = ref({});

// Отправка данных запроса
const requestInProgress = ref(false);
const errorsMessages = ref([]);

const sendForm = async () => {
	for (const formKey in form.value) {
		form.value[formKey].validateResult = '';
	}

	const { status, key, validateResult } = validateForm(form.value);

	if (status) {
		if (Object.keys(selectedPlayer.value).length === 0) {
			errorsMessages.value = ['Необходимо выбрать игрока'];
		} else {
			await sendRequest();
		}
	} else {
		form.value[key].validateResult = validateResult;
		errorsMessages.value = [validateResult];
	}
}

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.slug = route.params.slug;

		if (body.board_game_game_list_id) {
			body.board_game_game_list_id = props.board_game_game_list_id;
		} else if (props.game.id) {
			body.board_game_game_list_id = props.game.id;
		}

		body.comment = form.value.comment.value;

		body.additionalParams = {
			player: selectedPlayer.value.id,
			message: form.value.comment.value,
		};

		const response = await sendApiRequest('board-game/v2/player-game/invite-to-coop/', 'POST', body, 'sendFinishGameRequest', '');

		if (response) {
			requestInProgress.value = false;

			alert(`Приглашение успешно отправлено ${selectedPlayer.value.user.name}`);
			form.value.comment.value = null;

			emit('updateData');
			// emit('toggleFormVisible');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<ui-BigPreloader v-if="requestGetPlayersInProgress" class="h-full" />
	<div v-else class="w-full mt-[1rem]">
		<AlertBox
				:errorsMessages="errorsMessages"
				class="mb-2"
		/>
		<div v-if="isAuth">
			<SelectPlayer
					v-if="fetchedPlayers"
					:players="getPlayersForItem('other', fetchedPlayers)"
					v-model="selectedPlayer"
			/>

			<FormGenerator
					name="comment"
					:element="form.comment"
					validateErrorPosition="bottom"
					labelClasses="lg:mr-4 mt-[10px] mb-[10px] !mr-0 block"
					:fieldClasses="form.comment.classes"
					:showMaxLength="true"
			/>

			<div class="item-box">
				Вы можете пригласить другого участника ивента для прохождении игры, в этом случае участник получить 50% от стоимости игры ({{ points/2 }})
			</div>
			<div class="flex">
				<button
						class="btn btn-simple-1 w-1/2 mr-[2rem]"
						@click="emit('toggleFormVisible')"
				>Отмена</button>
				<ActionButton
						buttonClasses="btn btn-simple-1 w-1/2"
						buttonName="Отправить"
						:actionInProgress="requestInProgress"
						@startAction="sendForm()"
				/>
			</div>
		</div>
		<div v-else>
			Данный функционал доступен только авторизованному пользователю
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
