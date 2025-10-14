<script setup>
import UserShortCard from '@/modules/boardGame/components/user/UserShortCard.vue';

const emit = defineEmits(['update']);

const route = useRoute();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error, choiceAlert } = notifications();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	userStore,
} = userFunctions();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
});

const type = computed(() => {
	if (props.element.created_by !== userStore.user.id) {
		return 'incoming';
	} else if (props.element.created_by === userStore.user.id) {
		return 'outgoing';
	}
});

const name = computed(() => {
	switch (props.element.type) {
		case 'switchGame': return 'Обмен игрой';
	}
});

const status = computed(() => {
	switch (props.element.status) {
		case 1: return 'Запрос отправлен';
		case 2: return 'Запрос принят';
		case 3: return 'Отказано';
	}
});

const statusClass = computed(() => {
	switch (props.element.status) {
		case 1: return 'blue';
		case 2: return 'green';
		case 3: return 'red';
	}
});

/* Функции изменения запросов */
// TODO добавить Вы уверены? да нет

const startAction = (type) => {
	choiceAlert(
			{
				title: 'Вы уверены?',
				message: 'Это действие нельзя отменить. Вы уверены?',
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendRequest(type);
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

const requestInProgress = ref(false);

const sendRequest = async (type) => {
	requestInProgress.value = true;

	try {
		const body = {
			type,
			id: props.element.id,
			slug: route.params.slug,
		};

		const response = await sendApiRequest('board-game/v2/interactions/action/', 'POST', body, 'SetActionBoardGamePlayerInteractions', 'fullscreenTransparent');

		if (response.error) {
			error(response.error);
		} else if (response) {
			// Обработка ошибок

			requestInProgress.value = false;

			switch (type) {
				case 'accept': alert('Вы приняли предложение'); break;
				case 'refuse': alert('Вы отказались от предложения'); break;
				case 'recall': alert('Вы отозвали предложение'); break;
			}

			emit('update');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div :class="['item-box',  statusClass]">
		<div class="status-bar">
			{{ name }} ({{ status }}) - {{ getFormattedDate('d ru_mouths_name Y в H:i', element.created_at) }}
		</div>
		<div class="info">
			<div class="from-to-box">
				<template v-if="type === 'incoming'">
					<UserShortCard :user="element.with_player_data" />
					<font-awesome-icon class="icon" icon="fa-regular fa-circle-right" />
					<UserShortCard :user="userStore.user" />
				</template>
				<template v-else-if="type === 'outgoing'">
					<UserShortCard :user="userStore.user" />
					<font-awesome-icon class="icon" icon="fa-regular fa-circle-right" />
					<UserShortCard :user="element.with_player_data" />
				</template>
			</div>
			<div class="choice-btn">
				<div v-if="type === 'incoming'">
					<button
							class="btn btn-simple mr-2"
							@click="startAction('accept')"
					>Принять</button>
					<button
							class="btn btn-simple"
							@click="startAction('refuse')"
					>Отказаться</button>
				</div>
				<div v-else-if="type === 'outgoing'">
					<button
							class="btn btn-simple"
							@click="startAction('recall')"
					>Отозвать</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply
		block p-0
		bg-[var(--second-bg-color)] rounded-none w-full mb-2
	;

	&.violet {
		border-left: 8px solid #270062;
	}

	&.red {
		border-left: 8px solid #600000;
	}

	&.green {
		border-left: 8px solid #005d00;
	}

	&.blue {
		border-left: 8px solid #000460;
	}

	.status-bar {
		@apply w-full p-2 text-center bg-[var(--button-color-1)];
	}

	.info {
		@apply p-4;

		.from-to-box {
			@apply flex items-center;

			svg.icon {
				@apply text-[1.2rem] mr-2 ml-2;
			}
		}

		.choice-btn {
			@apply flex;
		}
	}
}
</style>
