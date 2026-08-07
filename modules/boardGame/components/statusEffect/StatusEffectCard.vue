<script setup>
const emit = defineEmits(['updateList', 'debugSetStatusEffect']);

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

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
	showDebugControlPanel: {
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

/* Активация статус эффекта */
const activateSe = (type) => {
	let title = '';
	let message = '';

	if (type === 'accept') {
		title = 'Применение статус эффекта';
		message = 'Вы выполнили условие статус эффекта?';

		props.element.statusEffectBind.statusEffect.actions.forEach((item) => {
			if (item.actions) {
				item.actions.forEach((action, key) => {
					if (key === 1 && action.choiceMessage) {
						message = action.choiceMessage;
					}
				});
			}
		});
	} else if (type === 'denied') {
		title = 'Отказ от выполнения статус эффекта';
		message = 'При отказе от статус эффекта, вы получите штраф.';

		props.element.statusEffectBind.statusEffect.actions.forEach((item) => {
			if (item.actions) {
				item.actions.forEach((action, key) => {
					if (key === 0 && action.choiceMessage) {
						message = action.choiceMessage;
					}
				});
			}
		});
	} else {
		return false;
	}

	choiceAlert(
			{
				title,
				message,
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendActivateSeRequest(type);
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

const sendActivateSeRequest = async (type) => {
	requestInProgress.value = true;

	try {
		const body = {
			id: props.element.id,
			slug: route.params.slug,
			type,
		}

		const response = await sendApiRequest('board-game/v2/status-effect/use', 'POST', body, 'bg_useStatusEffect', '', 'method');

		if (response) {
			if (response.status === 'error' && response.status_message) {
				error(response.status_message);
			} else if (response.error) {
				error(response.error);
			} else {
				if (response.message) {
					alert(response.message, 10000);
				} else {
					if (type === 'accept') {
						alert(`Вы применили статус эффект "${props.element.statusEffectBind.statusEffect.name}"`);
					} else if (type === 'denied') {
						alert(`Вы отказались от статус эффекта "${props.element.statusEffectBind.statusEffect.name}"`);
					}
				}
				if (!hasWebSocked()) refreshLayoutData();
				emit('updateList');
			}

			requestInProgress.value = false;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
	/>
	<div
			v-else-if="element && element.statusEffectBind.statusEffect"
			:class="[
				'item-box',
				getTypeClass(element?.statusEffectBind?.statusEffect?.debuff),
				element.statusEffectBind.statusEffect.quantity > 1 ? 'add-padding-right' : '',
				theme,
				classes,
			]"
	>
		<template v-if="element.statusEffectBind.statusEffect?.image">
			<img
					v-if="useLightBox"
					:src="getResizeImg(element.statusEffectBind.statusEffect.image)"
					:alt="element.statusEffectBind.statusEffect.name"
					:title="element.statusEffectBind.statusEffect.name"
					:class="['cursor-pointer media-obj']"
					:media-id="element.statusEffectBind.statusEffect.image.id"
			>
			<img
					v-else
					:src="getResizeImg(element.statusEffectBind.statusEffect.image)"
					:alt="element.statusEffectBind.statusEffect.name"
					:title="element.statusEffectBind.statusEffect.name"
			>
		</template>

		<div class="info">
			<span class="name">{{ element.statusEffectBind.statusEffect.name }}</span>
			<span
					v-if="element.statusEffectBind.statusEffect.description"
					:class="[
							'description',
							cutDescription ? 'cut-description' : '',
					]"
			>
				{{ element.statusEffectBind.statusEffect.description }}
			</span>
			<div
					v-if="element.active"
					v-for="(action, key) in element.statusEffectBind.statusEffect.actions"
					class="actions"
			>
				<template v-if="showControlPanel && action && action.type === 'choice'">
					<button
							class="btn btn-simple mr-2"
							@click="activateSe('accept')"
					>Выполнен</button>
					<button
							class="btn btn-simple"
							@click="activateSe('denied')"
					>Отказаться</button>
				</template>
				<template v-if="showControlPanel && action && action.type === 'onlyAccept'">
					<button
							class="btn btn-simple mr-2"
							@click="activateSe('accept')"
					>Выполнен</button>
				</template>
			</div>
			<div v-if="showDebugControlPanel">
				<button
						class="btn btn-simple mr-2"
						@click="emit('debugSetStatusEffect', element)"
				>Наложить на себя статус эффект</button>
			</div>
		</div>
		<div
				v-if="element.statusEffectBind.statusEffect.quantity > 1"
				class="count-panel"
		>
			x{{ element.statusEffectBind.statusEffect.quantity }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded-none flex relative min-h-[86px];

	&.gamblingGame {
		@apply w-full;
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

	&.default {}

	img {
		@apply w-[70px] h-[70px];
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)];

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

		.additional-box {
			@apply block mt-2;
		}
	}

	.control-panel {
		@apply absolute right-[1rem];

		.use-button {
			@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem] cursor-pointer;
		}

		.close-button {
			@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
		}
	}

	.count-panel {
		@apply absolute right-0 top-0 flex justify-between items-center text-[1.5rem] h-full p-[1rem];
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
