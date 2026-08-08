<script setup>
import SelectPlayerDetailList from '@/modules/boardGame/components/user/player/SelectPlayerDetailList.vue';

import TheCunningElf from '@/modules/boardGame/components/board/cellGames/TheCunningElf.vue';
import MysteryButton from '@/modules/boardGame/components/board/cellGames/MysteryButton.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { notifications } from '@/composables/notifications.js';
const { choiceAlert, error, alert } = notifications();

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
	hasUsed: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		default: null,
	},
});

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
				if (!hasWebSocked()) refreshLayoutData();
			}
		}
	} catch (e) {
		error(e);
	}
}

const setAction = (type) => {
	switch(type) {
		case "fightWithBoss-win":
			choiceAlert(
					{
						title: 'Вы уверены?',
						message: 'Чтобы отправить это действие вы должны победить босса ячейки, вы победили босса?',
						buttons: [
							{
								name: 'Да',
								func: () => {
									setRequest('activate-effect');
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
			break;
	}
}

const setRequest = async (type) => {
	try {
		const body = {
			id: props.element.id,
			slug: route.params.slug,
			type,
		}

		const response = await sendApiRequest('board-game/v2/boardStatusEffect/use', 'POST', body, 'bg_usePositionEffect', 'small', 'method');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				if (response.message) {
					alert(response.message, 10000);
				} else {
					alert(`Успешно выполнено`);
				}

				await refreshNuxtData('getBoardGameBoard');
				if (!hasWebSocked()) refreshLayoutData();
			}
		}
	} catch (e) {
		error(e);
	}
}

const getGameInitComponent = (name) => {
	switch (name) {
		case 'TheCunningElf': return TheCunningElf;
		case 'MysteryButton': return MysteryButton;
	}
}
</script>

<template>
	<div
			v-if="Object.keys(element).length > 0"
			:class="[
				'item-box',
				showControlPanel || element.quantity > 1 ? 'add-padding-right' : '',
				theme,
				classes,
			]"
		>
		<template v-if="element.boardPositionEffect?.title_image">
			<img
					v-if="useLightBox"
					:src="getResizeImg(element.boardPositionEffect?.title_image)"
					:alt="element.boardPositionEffect.name"
					:title="element.boardPositionEffect.name"
					:class="['media-obj', hasUsed ? 'has-used' : '']"
					:media-id="element.boardPositionEffect?.title_image?.id"
			>
			<img
					v-else
					:src="getResizeImg(element.boardPositionEffect?.title_image)"
					:alt="element.boardPositionEffect.name"
					:title="element.boardPositionEffect.name"
					:class="[hasUsed ? 'has-used' : '']"
			>
		</template>
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
		</div>
	</div>
	<div
			v-if="element.boardPositionEffect && element.boardPositionEffect.actions && !hasUsed"
			v-for="(action, key) in element.boardPositionEffect.actions"
			:key="key"
			class="actions"
	>
		<template v-if="showControlPanel && action && action.effectType === 'fightWithBoss'">
			<button
					class="btn btn-simple"
					@click="setAction('fightWithBoss-win')"
			>
				Я победил босса
			</button>
		</template>
		<template v-if="showControlPanel && action && action.type === 'playerInteractions'">
			<span class="block mt-2 mb-2">Выберите игрока для приглашения</span>
			<SelectPlayerDetailList
					v-model="selectedPlayer"
					bgClasses="!bg-[var(&#45;&#45;main-hover-color)]"
					:target="action.target"
					:expectedPlayers="[userStore.player.id]"
					:currentPlayer="userStore.player"
					selectedPlayerTheme="short"
			/>
			<button
					v-if="Object.keys(selectedPlayer).length > 0"
					class="btn btn-simple"
					@click="sendInvitation()"
			>
				Отправить приглашение
			</button>
		</template>
		<template v-if="showControlPanel && action && action.type === 'game'">
			{{ action }}
			{{ action.gameName }}
			{{ getGameInitComponent(action.gameName) }}
			<component
					:is="getGameInitComponent(action.gameName)"
					:element="element"
			/>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded-none flex relative min-h-[86px];

	.has-used {
		filter: grayscale(100%);
	}

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
