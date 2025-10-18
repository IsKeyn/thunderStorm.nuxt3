<script setup>
import SelectPlayer from '@/modules/boardGame/components/user/player/SelectPlayer.vue';

import { computed, inject, ref } from "vue";

const layoutMethods = inject('layoutMethods')

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { notifications } from '@/composables/notifications.js';
const { choiceAlert, error, alert } = notifications();

import { players } from '@/composables/BoardGame/players.js';
const { getPlayersForItem } = players();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: '',
	},
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	cutDescription: {
		type: Boolean,
		default: false,
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
	theme: {
		type: String,
		default: 'default',
	},
});

const getTypeClass = (type) => {
	if (type) {
		return 'red';
	} else {
		return 'green';
	}
}

// Проверяем нужно ли грузить список игроков
const needOtherPlayers = computed(() => {
	let returnData = false;

	JSON.parse(props.element.boardPositionEffect.actions).forEach((item) => {
		if (item.target !== 'current') {
			returnData = true;
		}
	});

	return returnData;
})

const requestName = 'getBoardGamePlayersWithInventory';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (needOtherPlayers.value) {
				let type = null;

				JSON.parse(props.element.boardPositionEffect.actions).forEach((item, key) => {
					if (key === 0 && item.value) {
						type = item.value;
					}
				});

				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/listWithInventory/${route.params.slug}/`, 'GET', { type }, requestName, '')
				);

				return response.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedPlayers = computed(() => requestData.value || null);

const selectedPlayer = ref({});

const sendInvitation = async () => {
	try {
		const elementAction = JSON.parse(props.element.boardPositionEffect.actions);

		const additionalParams = {};
		additionalParams.player = selectedPlayer.value.id;

		if (elementAction[0]) {
			additionalParams.message = `приглашает тебя посоревноваться за очки в игре ${elementAction[0].name}, победитель получит ${elementAction[0].pointsForWin} очков`;
		}

		const body = {
			id: props.element.id,
			slug: route.params.slug,
			additionalParams,
		}

		const response = await sendApiRequest('board-game/v2/boardStatusEffect/use', 'POST', body, 'bg_usePositionEffect', 'small', 'method');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				if (response.message) {
					alert(response.message, 10000);
				} else {
					alert(`Предложение было отправлено`);
				}

				await refreshNuxtData('getBoardGameBoard');
			}
		}
	} catch (e) {
		error(e);
	}
}
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<div
			v-else-if="Object.keys(element).length > 0"
			:class="[
				'item-box',
				getTypeClass(element?.boardPositionEffect?.debuff),
				showControlPanel || element.quantity > 1 ? 'add-padding-right' : '',
				theme,
				classes,
			]"
		>
		<img
				v-if="element.boardPositionEffect?.title_image"
				:src="getResizeImg(element.boardPositionEffect?.title_image)"
				:alt="element.boardPositionEffect.name"
				:title="element.boardPositionEffect.name"
				:class="[useLightBox ? 'cursor-pointer' : '']"
				@click="useLightBox ? layoutMethods.setOpenedImage(element.boardPositionEffect.title_image) : false"
		>
		<div class="info">
			<span class="name">
				{{ element.boardPositionEffect.name }}
			</span>
			<span
					v-if="element.boardPositionEffect.description"
					:class="[
							'description',
							cutDescription ? 'cut-description' : '',
					]"
			>
				{{ element.boardPositionEffect.description }}
			</span>
			<div
					v-if="element.boardPositionEffect && element.boardPositionEffect.actions"
					v-for="(action, key) in JSON.parse(element.boardPositionEffect.actions)"
					:key="key"
					class="actions"
			>
				<template v-if="showControlPanel && action && action.type === 'playerInteractions'">
					<span class="">Выберите игрока для приглашения</span>
					<SelectPlayer
							v-if="fetchedPlayers"
							:players="getPlayersForItem(action.target, fetchedPlayers)"
							v-model="selectedPlayer"
					/>
					<button
							v-if="Object.keys(selectedPlayer).length > 0"
							class="btn btn-simple"
							@click="sendInvitation()"
					>
						Отправить приглашение
					</button>
				</template>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded-none flex relative min-h-[86px];

	&.default {
		&.red {
			border-left: 8px solid #600000;
		}

		&.green {
			border-left: 8px solid #005d00;
		}

		&.blue {
			border-left: 8px solid #000460;
		}
	}

	&.active {
		@apply bg-[var(--second-active-color)];
	}

	&.add-padding-right {
		@apply pr-[3rem];
	}

	img {
		@apply w-[70px] h-[70px];
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)] w-full;

		.name {
			@apply block mb-1 uppercase;
		}

		.description {
			@apply block;

			&.cut-description {
				@apply w-[200ch];

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.street-light-theme {
	.item-box {
		.info {
			@apply text-[var(--main-dark-text-color)];
		}
	}
}
</style>
