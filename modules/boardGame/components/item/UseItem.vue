<script setup>
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import SelectPlayer from '@/modules/boardGame/components/user/player/SelectPlayer.vue';
import SelectItem from '@/modules/boardGame/components/item/SelectItem.vue';
import SelectEffect from '@/modules/boardGame/components/statusEffect/SelectEffect.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { computed, ref, watch } from "vue";

const emit = defineEmits(['openCloseModalFunc', 'useItemFromEmit']);

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { players } from '@/composables/BoardGame/players.js';
const { getPlayersForItem } = players();

const props = defineProps({
	item: {
		type: Object,
		default: {},
	},
	showItemActions: {
		type: Boolean,
		default: false,
	}
});

// Проверяем нужно ли грузить список игроков
const needOtherPlayers = computed(() => {
	let returnData = false;

	props.item.item.item.actions.forEach((item) => {
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
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/listWithInventory/${route.params.slug}/`, 'GET', {}, requestName, '')
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

const actions = {
	type: {
		addPoints: {
			name: 'Увеличивает количество очков',
		},
		removePoints: {
			name: 'Уменьшает количество очков',
		},
		diceChange: {
			name: 'Изменение кубика',
		},
		addItem: {
			name: 'Добавляет предмет',
		},
		removeItem: {
			name: 'Удаляет предмет',
		},
		removeNegativeItem: {
			name: 'Удаляет негативный предмет',
		},
		stealItem: {
			name: 'Крадет предмет',
		},
		changeUserOwner: {
			name: 'Меняет владельца предмета',
		},
		movePlayer: {
			name: 'Перемещение игрока по доске',
		},
		pushPlayer: {
			name: 'Толкнуть игрока',
		},
		applyStatusEffect: {
			name: 'Накладывает статус игрока (бафф или дебафф)',
		},
	},
	direction: {
		back: {
			name: 'назад',
		},
		forward: {
			name: 'вперёд',
		},
	},
	target: {
		current: {
			name: 'на меня',
		},
		other: {
			name: 'на другого игрока',
		},
		all: {
			name: 'на всех',
		},
		allExpectMe: {
			name: 'на всех, кроме меня',
		},
		fromTo: {
			name: 'от одного игрока другому',
		},
		nearestPlayer: {
			name: 'на ближайщего игрока',
		},
		positionLeader: {
			name: 'лидер на игровой доске',
		},
	},
};

const selectedPlayer = ref({});
const selectedSecondPlayer = ref({});
const selectedItem = ref({});
const selectedEffect = ref({});

const useItem = () => {
	const validateRes = validate();

	if (validateRes) {
		const arg = {
			item: props.item,
			additionalParams: {}
		};

		if (Object.keys(selectedPlayer.value).length !== 0) {
			arg.additionalParams.player = selectedPlayer.value.id;
		}

		if (Object.keys(selectedSecondPlayer.value).length !== 0) {
			arg.additionalParams.secondPlayer = selectedSecondPlayer.value.id;
		}

		if (Object.keys(selectedItem.value).length !== 0) {
			arg.additionalParams.item = selectedItem.value.id;
		}

		if (Object.keys(selectedEffect.value).length !== 0) {
			arg.additionalParams.selectedEffect = selectedEffect.value.id;
		}

		if (form.value.message.value) {
			arg.additionalParams.message = form.value.message.value;
		}

		if (logMessage.value) {
			arg.additionalParams.logMessage = logMessage.value;
		}

		emit('useItemFromEmit', arg);
	} else {

	}
}

const form = ref({
	message: {
		name: 'Сообщение',
		type: 'textarea',
		value: 'Применил на вас предмет "' + props.item.item.item.name + '"',
		placeholder: '',
		classes: ['w-full', 'mt-[1rem]'],
	},
});

const validateErrors = ref([]);

const validate = () => {
	let validateResult = true;

	validateErrors.value = [];

	if (props.item.item.item.actions) {
		props.item.item.item.actions.forEach((item) => {
			const regex = /^noFurther_\d+$/

			if (
					(item.target === 'other' || item.target === 'fromTo' || item.target === 'nearestPlayer' || regex.test(item.target))
					&& Object.keys(selectedPlayer.value).length === 0
			) { // Проверка, если предмет требует выбора игрока
				const errorMessage = 'Данный предмет требует выбора игрока';

				if (!validateErrors.value.includes(errorMessage)) {
					validateErrors.value.push(errorMessage);
				}
				validateResult = false;
			} else if (
					(item.type === 'removeNegativeItem' || item.type === 'stealItem' || item.type === 'changeUserOwner')
					&& Object.keys(selectedItem.value).length === 0
			) { // Проверка, если предмет требует выбора предмета
				const errorMessage = 'Данный предмет требует выбора предмета';

				if (!validateErrors.value.includes(errorMessage)) {
					validateErrors.value.push(errorMessage);
				}
				validateResult = false;
			} else if (
					(item.type === 'removeNegativeEffect' || item.type === 'stealEffect' || item.type === 'changeUserOwnerEffect')
					&& Object.keys(selectedEffect.value).length === 0
			) { // Проверка, если предмет требует выбора статус эффекта
				const errorMessage = 'Данный предмет требует выбора статус эффекта';

				if (!validateErrors.value.includes(errorMessage)) {
					validateErrors.value.push(errorMessage);
				}
				validateResult = false;
			} else if (
					item.target === 'fromTo'
					&& Object.keys(selectedSecondPlayer.value).length === 0
			) {
				const errorMessage = 'Данный предмет требует выбора второго игрока';

				if (!validateErrors.value.includes(errorMessage)) {
					validateErrors.value.push(errorMessage);
				}

				validateResult = false;
			}
		});
	}

	return validateResult;
};

const getItemByFilter = (type = null) => {
	if (Object.keys(selectedPlayer.value).length > 0) {
		let filterItems = selectedPlayer.value.inventory.filter((item) => !item.has_used);

		if (type === 'removeNegativeItem') {
			filterItems = filterItems.filter((item) => item.item.item.type === 1);
		}

		return filterItems;
	}
}

const getEffectByFilter = (type = null) => {
	if (Object.keys(selectedPlayer.value).length > 0) {
		let filterEffects = selectedPlayer.value.status_effects.filter((item) => item.active);

		if (type === 'removeNegativeEffect') {
			filterEffects = filterEffects.filter((item) => item.statusEffect?.debuff === true);
		}

		return filterEffects;
	}
}

/* Очистка предмета, при выборе другого игрока */
watch(() => selectedPlayer.value, () => {
	selectedItem.value = {};
	setMessages();
}, { deep: true });


watch(() => selectedItem.value, () => {
	selectedSecondPlayer.value = {};
	setMessages();
}, { deep: true });

watch(() => selectedSecondPlayer.value, () => {
	setMessages();
}, { deep: true });

const logMessage = ref('');
const notificationMessage = ref('');

const setMessages = () => {
	const defaultLogMessage = `Использовал предмет "${props.item.item.item.name}"`;
	const defaultNotificationMessage = `Использовал на тебя предмет "${props.item.item.item.name}"`;

	let message = '';
	let log = '';

	/* Дополнение сообщений информацией о выбранном участнике */
	if (Object.keys(selectedPlayer.value).length > 1) {
		log = `${defaultLogMessage} на участника "${selectedPlayer.value.user.name}"`;
		message = `${defaultNotificationMessage}`;
	}

	/* Дополнение сообщений информацией о предмете */
	if (Object.keys(selectedItem.value).length > 1) {
		if (!log) {
			log = `${defaultLogMessage}`;
		}

		log += ` выбрал предмет "${selectedItem.value.item.item.name}"`;

		if (!message) {
			message = `${defaultNotificationMessage}`;
		}

		message += ` выбрал предмет "${selectedItem.value.item.item.name}"`;
	}

	/* Дополнение сообщений информацией о выбранном втором участнике */
	if (Object.keys(selectedSecondPlayer.value).length > 1) {
		if (!log) {
			log = `${defaultLogMessage}`;
		}

		log += ` выбрал второго участника "${selectedSecondPlayer.value.user.name}"`;

		if (!message) {
			message = `${defaultNotificationMessage}`;
		}

		message += ` выбрал второго участника "${selectedSecondPlayer.value.user.name}"`;
	}

	logMessage.value = log;
	notificationMessage.value = message;

	form.value.message.value = notificationMessage.value;
}

/* Функция отображает сообщение о том на кого распространяется эффект */
const effectFor = (action) => {
	if (actions.target.hasOwnProperty(action.target)) {
		return actions.target[action.target].name;
	}

	if (action.target.includes('noFurther')) {
		const maxDistance = Number(action.target.split('_')[1]);

		return `На игрока не дальше ${maxDistance} клеток от тебя`;
	}
}
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<div v-else-if="Object.keys(item).length > 1">
		<span class="inv-title">Вы собираетесь использовать предмет:</span>
		<ItemCard
				:element="item.item"
				:useLightBox="true"
		/>

		<div v-if="item.item.item.actions">
			<div v-if="showItemActions">
				<div class="inv-title">
					Это предмет с автоматическим применением, он выполнит следующие действия:
				</div>
				<div class="items-do-list">
					<div
							class="item-do"
							v-for="(action, key) in item.item.item.actions"
							:key="key"
					>
						<span v-if="actions.type.hasOwnProperty(action.type)">Действие: {{ actions.type[action.type].name }}</span>
						<span v-if="action.direction && actions.direction.hasOwnProperty(action.direction)">Действие: {{ actions.direction[action.direction].name }}</span>
						<span v-if="action.value">Значение: {{ action.value }}</span>
						<span v-if="effectFor(action)">Распространяется: {{ effectFor(action) }}</span>
					</div>
				</div>
			</div>
			<div
					v-for="(action, key) in item.item.item.actions"
					:key="key"
			>
				<template v-if="action.showUi !== false">
					<template
							v-if="
								action.target === 'other'
								|| action.target === 'fromTo'
								|| action.target === 'nearestPlayer'
								|| action.target.includes('noFurther')
							"
					>
						<span class="inv-title">Данный предмет требует выбора игрока:</span>
						<SelectPlayer
								:players="getPlayersForItem(action.target, fetchedPlayers)"
								v-model="selectedPlayer"
						/>
					</template>

					<template
							v-if="
								action.type === 'removeNegativeItem'
								|| action.type === 'stealItem'
								|| action.type === 'changeUserOwner'
							"
					>
						<div v-if="Object.keys(selectedPlayer).length > 0">
							<span class="inv-title">Данный предмет требует выбора предмета:</span>
							<SelectItem
									:player="selectedPlayer"
									:items="getItemByFilter(action.type)"
									v-model="selectedItem"
							/>
						</div>
					</template>

					<template v-if="action.type === 'removeNegativeEffect' || action.type === 'stealEffect' || action.type === 'changeUserOwnerEffect'">
						<div v-if="Object.keys(selectedPlayer).length > 0">
							<span class="inv-title">Данный предмет требует выбора эффекта:</span>
							<SelectEffect
									:player="selectedPlayer"
									:items="getEffectByFilter(action.type)"
									v-model="selectedEffect"
							/>
						</div>
					</template>

					<template v-if="Object.keys(selectedPlayer).length > 0 && Object.keys(selectedItem).length !== 0 && (action.target === 'fromTo')">
						<span class="inv-title">Данный предмет требует выбора второго игрока:</span>
						<SelectPlayer
								:players="fetchedPlayers.filter((item) => item.user_id !== userStore.user.id).filter((item) => item.user_id !== selectedPlayer.user_id)"
								v-model="selectedSecondPlayer"
						/>
					</template>
				</template>
			</div>
			<div v-if="Object.keys(selectedPlayer).length > 0">
				<span class="inv-title">Выбранный вами игрок получит уведомление с тектом, вы можете его отредактировать или дополнить:</span>
				<FormGenerator
						name="message"
						:element="form.message"
						:showTitle="false"
						:clearButtom = "true"
						wrapClasses="w-full md:w-3/12"
						labelClasses="mr-4"
						:fieldClasses="form.message.classes"
				/>
			</div>
		</div>
		<layout-InfoBlock
				v-else
				text="Это предмет с ручным примением, вы должны сами выполнить действия, которые описаны на предмете, после его применения"
		/>

		<template v-if="validateErrors.length > 0">
			<div v-for="(error, key) in validateErrors" class="use-item-description error">
				<font-awesome-icon :icon="['fas', 'circle-info']" beat />
				<span>{{ error }}</span>
			</div>
		</template>

		<span class="inv-title">Использовать?</span>
		<div class="button-box">
			<button
					class="btn btn-simple-1 mr-[8px]"
					@click="useItem()"
			>
				Да
			</button>
			<button
					class="btn btn-simple-1 mr-[8px]"
					@click="emit('openCloseModalFunc')"
			>
				Нет
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.title {
	@apply mb-[1rem] block;
}

.use-item-description {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex relative items-center text-[var(--main-dark-text-color)];

	&.error {
		@apply bg-[var(--alert-color)] mb-0 mt-2;
	}

	svg {
		@apply text-[1.5rem] mr-[1rem];
	}
}

.inv-title {
	@apply font-bold mb-4 mt-4 uppercase block;
}

.items-do-list {
	@apply flex;

	.item-do {
		@apply p-2 mb-2 mr-2 bg-[var(--second-bg-color)] rounded relative items-center w-full lg:w-1/3;

		span {
			@apply block mb-[0.2rem];
		}
	}
}

.button-box {
	.btn {
		@apply w-1/5;
	}
}
</style>
