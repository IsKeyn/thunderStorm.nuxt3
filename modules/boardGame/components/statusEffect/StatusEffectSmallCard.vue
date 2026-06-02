<script setup>
import Tooltip from '@/components/ui/Tooltip.vue';

import { inject, watch } from "vue";

const emit = defineEmits(['updateList']);
const layoutMethods = inject('layoutMethods')

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

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

		JSON.parse(props.element.statusEffect.actions).forEach((item) => {
			if (item.actions) {
				item.actions.forEach((action, key) => {
					if (key === 1 && action.message) {
						message = action.message;
					}
				});
			}
		});
	} else if (type === 'denied') {
		title = 'Отказ от выполнения статус эффекта';
		message = 'При отказе от статус эффекта, вы получите штраф.';

		JSON.parse(props.element.statusEffect.actions).forEach((item) => {
			if (item.actions) {
				item.actions.forEach((action, key) => {
					if (key === 0 && action.message) {
						message = action.message;
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
			if (response.error) {
				error(response.error);
			} else {
				if (response.message) {
					alert(response.message, 10000);
				} else {
					if (type === 'accept') {
						alert(`Вы применили статус эффект "${props.element.statusEffect.name}"`);
					} else if (type === 'denied') {
						alert(`Вы отказались от статус эффекта "${props.element.statusEffect.name}"`);
					}
				}

				requestInProgress.value = false;

				if (!hasWebSocked()) refreshLayoutData();
				emit('updateList');
			}
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
<!--	<ui-BigPreloader v-if="requestInProgress" />-->
<!--	<div-->
<!--			v-else-if="element"-->
<!--			:class="[-->
<!--			'item-box',-->
<!--			getTypeClass(element.statusEffect.debuff),-->
<!--			showControlPanel || element.quantity > 1 ? 'add-padding-right' : '',-->
<!--			theme,-->
<!--			classes,-->
<!--	]">-->
	<div class="status-effect-small-card">
		<Tooltip>
			<div class="description">
				<div class="mb-2">
					{{ element.statusEffect.name }}
				</div>
<!--				<div>-->
<!--					{{ element.statusEffect.description }}-->
<!--				</div>-->
			</div>
		</Tooltip>
		<img
				v-if="element.statusEffect?.image"
				:src="getResizeImg(element.statusEffect?.image)"
				:alt="element.statusEffect.name"
				:title="element.statusEffect.name"
				:class="[useLightBox ? 'cursor-pointer' : '']"
				@click="useLightBox ? layoutMethods.setOpenedImage(element.statusEffect.image) : false"
		>
	</div>
<!--		<div class="info">-->
<!--			<span class="name">-->
<!--				{{ element.statusEffect.name }}-->
<!--			</span>-->
<!--			<span-->
<!--					v-if="element.statusEffect.description"-->
<!--					:class="[-->
<!--							'description',-->
<!--							cutDescription ? 'cut-description' : '',-->
<!--					]"-->
<!--			>-->
<!--				{{ element.statusEffect.description }}-->
<!--			</span>-->
<!--			<div-->
<!--					v-if="element.active"-->
<!--					v-for="(action, key) in JSON.parse(element.statusEffect.actions)"-->
<!--					class="actions"-->
<!--			>-->
<!--				<template v-if="showControlPanel && action && action.type === 'choice'">-->
<!--					<button-->
<!--							class="btn btn-simple mr-2"-->
<!--							@click="activateSe('accept')"-->
<!--					>Выполнен</button>-->
<!--					<button-->
<!--							class="btn btn-simple"-->
<!--							@click="activateSe('denied')"-->
<!--					>Отказаться</button>-->
<!--				</template>-->
<!--			</div>-->
<!--		</div>-->
<!--		<div-->
<!--				v-if="showControlPanel"-->
<!--				class="control-panel"-->
<!--		>-->
<!--		</div>-->
<!--		<div-->
<!--				v-if="element.statusEffect.quantity > 1"-->
<!--				class="count-panel"-->
<!--		>-->
<!--			x{{ element.statusEffect.quantity }}-->
<!--		</div>-->
<!--	</div>-->
</template>

<style lang="scss" scoped>
.status-effect-small-card {
	@apply relative w-[60px] h-[60px];

	border: 2px solid var(--third-block-color);

	img {
		width: 100%;
	}

	.description {
		@apply bg-[var(--second-bg-color)] w-[150px] text-center mb-[2px] p-[5px] text-[var(--main-dark-text-color)];
	}
}
//
//.item-box {
//	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded-none flex relative min-h-[86px];
//
//	&.gamblingGame {
//		@apply w-full;
//	}
//
//	&.default {
//		&.red {
//			border-left: 8px solid #600000;
//		}
//
//		&.green {
//			border-left: 8px solid #005d00;
//		}
//
//		&.blue {
//			border-left: 8px solid #000460;
//		}
//	}
//
//	&.active {
//		@apply bg-[var(--second-active-color)];
//	}
//
//	&.add-padding-right {
//		@apply pr-[3rem];
//	}
//
//	&.default {
//		//&:hover {
//		//	@apply bg-[var(--second-active-color)];
//		//}
//	}
//
//	img {
//		@apply w-[70px] h-[70px];
//	}
//
//	.info {
//		@apply pl-3 pr-3 text-[var(--main-text-color)];
//
//		.name {
//			@apply block mb-1 uppercase;
//		}
//
//		.description {
//			@apply block;
//
//			&.cut-description {
//				@apply w-[200ch];
//
//				white-space: nowrap;
//				overflow: hidden;
//				text-overflow: ellipsis;
//			}
//		}
//
//		.additional-box {
//			@apply block mt-2;
//		}
//	}
//
//	.control-panel {
//		@apply absolute right-[1rem];
//
//		.use-button {
//			@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem] cursor-pointer;
//		}
//
//		.close-button {
//			@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
//		}
//	}
//
//	.count-panel {
//		@apply absolute right-0 top-0 flex justify-between items-center text-[1.5rem] h-full p-[1rem];
//	}
//}
</style>

<style lang="scss" scoped>
//.street-light-theme {
//	.item-box {
//		.info {
//			@apply text-[var(--main-dark-text-color)];
//		}
//	}
//}
</style>
