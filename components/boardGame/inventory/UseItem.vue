<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import SelectPlayer from '@/components/boardGame/user/SelectPlayer.vue';
import SelectItem from '@/components/boardGame/inventory/SelectItem.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref, watch } from "vue";

const emit = defineEmits(['setOpenedImage', 'openCloseModalFunc', 'useItemFromEmit']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const props = defineProps({
	item: {
		type: Object,
		default: {},
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

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

const useItem = () => {
	const validateRes = validate();

	if (validateRes) {
		const arg = {item: props.item, additionalParams: {}};

		if (Object.keys(selectedPlayer.value).length !== 0) {
			arg.additionalParams.player = selectedPlayer.value.id;
		}

		if (Object.keys(selectedSecondPlayer.value).length !== 0) {
			arg.additionalParams.secondPlayer = selectedSecondPlayer.value.id;
		}

		if (Object.keys(selectedItem.value).length !== 0) {
			arg.additionalParams.item = selectedItem.value.id;
		}

		if (form.value.message.value) {
			arg.additionalParams.message = form.value.message.value;
		}

		emit('useItemFromEmit', arg);
	} else {

	}
}

const form = ref({
	message: {
		name: 'Сообщение',
		type: 'textarea',
		value: 'Применил на вас предмет "' + props.item.name + '"',
		placeholder: '',
		classes: ['w-full', 'mt-[1rem]'],
	},
});

const validateErrors = ref([]);

const validate = () => {
	let validateResult = true;

	validateErrors.value = [];

	if (props.item.actions) {
		props.item.actions.forEach((item) => {
			if ((item.target === 'other' || item.target === 'fromTo') && Object.keys(selectedPlayer.value).length === 0) { // Проверка, если предмет требует выбора игрока
				validateErrors.value.push('Данный предмет требует выбора игрока');
				validateResult = false;
			} else if ((item.type === 'removeNegativeItem' || item.type === 'stealItem' || item.type === 'changeUserOwner') && Object.keys(selectedItem.value).length === 0) { // Проверка, если предмет требует выбора предмета
				validateErrors.value.push('Данный предмет требует выбора предмета');
				validateResult = false;
			} else if (item.target === 'fromTo' && Object.keys(selectedSecondPlayer.value).length === 0) {
				validateErrors.value.push('Данный предмет требует выбора второго игрока');
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
			filterItems = filterItems.filter((item) => item.item.type === 1);
		}

		return filterItems;
	}
}

/* Очистка предмета, при выборе другого игрока */
watch(() => selectedPlayer.value, () => {
	selectedItem.value = {};
}, { deep: true });


watch(() => selectedItem.value, () => {
	selectedSecondPlayer.value = {};
}, { deep: true });

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

const getPlayersForItem = (players, target) => {
	if (target === 'other' || target === 'fromTo') {
		return players.filter((item) => item.user_id !== userStore.user.id);
	}

	if (target === 'nearestPlayer') {
		const currentPlayerPosition = players.filter((item) => item.user_id === userStore.user.id)[0].position;

		const otherPlayersPositions = [];

		players.filter((item) => item.user_id !== userStore.user.id).forEach((item) => {
			otherPlayersPositions[item.user_id] = item.position;
		});

		/* Сравнение позиций */
		let minDiff = Infinity;
		const closestIndexes = [];

		otherPlayersPositions.forEach((num, index) => {
			const diff = Math.abs(num - currentPlayerPosition);

			if (diff < minDiff) {
				minDiff = diff;
				closestIndexes.length = 0; // Очищаем массив, если нашли новый минимум
				closestIndexes.push(index);
			} else if (diff === minDiff) {
				closestIndexes.push(index); // Добавляем, если разница такая же
			}
		});

		return players.filter((item) => closestIndexes.includes(item.user_id));
	}

	if (target.includes('noFurther')) {
		const maxDistance = Number(target.split('_')[1]);

		const currentPlayerPosition = Number(players.filter((item) => item.user_id === userStore.user.id)[0].position);

		return players.filter((item) => {
			if (item.position > currentPlayerPosition && item.position - currentPlayerPosition <= maxDistance) {
				return true;
			}

			if (item.position < currentPlayerPosition && currentPlayerPosition - item.position <= maxDistance) {
				return true;
			}
		});
	}
}
</script>

<template>
	<div v-if="Object.keys(item).length > 1">
		<span class="inv-title">Вы собираетесь использовать предмет:</span>
		<ItemCard
				:element="item"
				:useLightBox="true"
				@setOpenedImage="emit('setOpenedImage')"
		/>

		<div v-if="item.actions">
			<div class="inv-title">
				Это предмет с автоматическим применением, он выполнит следующие действия:
			</div>
			<div class="items-do-list">
				<div
						class="item-do"
						v-for="(action, key) in item.actions"
						:key="key"
				>
					<span v-if="actions.type.hasOwnProperty(action.type)">Действие: {{ actions.type[action.type].name }}</span>
					<span v-if="action.direction && actions.direction.hasOwnProperty(action.direction)">Действие: {{ actions.direction[action.direction].name }}</span>
					<span v-if="action.value">Значение: {{ action.value }}</span>
					<span v-if="effectFor(action)">Распространяется: {{ effectFor(action) }}</span>
				</div>
			</div>
			<div
					v-for="(action, key) in item.actions"
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
						<span class="inv-title">Данный предмет трубет выбора игрока:</span>
						<SelectPlayer
								:players="getPlayersForItem(boardGameInfo.players, action.target)"
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
							<span class="inv-title">Данный предмет трубет выбора предмета:</span>
							<SelectItem
									:player="selectedPlayer"
									:items="getItemByFilter(action.type)"
									v-model="selectedItem"
							/>
						</div>
					</template>

					<template v-if="Object.keys(selectedPlayer).length > 0 && Object.keys(selectedItem).length !== 0 && (action.target === 'fromTo')">
						<span class="inv-title">Данный предмет трубет выбора второго игрока:</span>
						<SelectPlayer
								:players="boardGameInfo.players.filter((item) => item.user_id !== userStore.user.id).filter((item) => item.user_id !== selectedPlayer.user_id)"
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
		<div v-else class="use-item-description">
			<font-awesome-icon :icon="['fas', 'circle-info']" />
			<span>Это предмет с ручным примением, вы должны сами выполнить действия, которые описаны на предмете, после его применения</span>
		</div>

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
					@click="emit('openCloseModalFunc')"
			>
				Нет
			</button>
			<button
					class="btn btn-simple-1 mr-[8px]"
					@click="useItem()"
			>
				Да
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.title {
	@apply mb-[1rem] block;
}

.use-item-description {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex relative items-center;

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
		@apply p-2 mb-2 mr-2 bg-[var(--second-bg-color)] rounded relative items-center w-1/3;

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
