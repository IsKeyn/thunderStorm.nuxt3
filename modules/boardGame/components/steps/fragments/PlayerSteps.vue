<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import Inventory from '@/modules/boardGame/components/item/Inventory.vue';
import ItemList from '@/modules/boardGame/components/item/ItemList.vue';
import Shop from '@/modules/boardGame/components/item/Shop.vue';
import Board from '@/modules/boardGame/components/board/Board.vue';
import GameProfile from '@/modules/boardGame/components/game/GameProfile.vue';
import GameListWithPagination from '@/modules/boardGame/components/game/GameListWithPagination.vue';
import AddGames from '@/modules/boardGame/components/game/AddGames.vue';

const emit = defineEmits(['setPageName']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const steps = {
	1: {
		title: 'Действие 1 - Лут предметов и их использование',
		buttonName: 'Инвентарь',
		description: 'Прокрутите рулетку предметов доступное количество раз, ознакомтесь с выпавшими предметами и при необходимости используйте их',
	},
	2: {
		title: 'Действие 2 - Игровая доска, ход и действия на клетках',
		buttonName: 'Игровое поле',
		description: 'Бросьте кубик, если вы попадете на клетку с действием, примите решение с действием',
	},
	3: {
		title: 'Действие 3 - Выбор игры и её прохождение',
		buttonName: 'Игра',
		description: 'Крутаните рулетку игр и выберите игру для прохождения, помните, что рерол игры накладывает штрафы. Во время прохождения игры необходимо включать таймер',
	},
};

const firstStep = () => {
	return Object.keys(steps)[0];
};

const lastStep = () => {
	const keys = Object.keys(steps);
	return keys[keys.length - 1];
};

const currentStep = ref(1);

const setStep = (stepNumber) => {
	emit('setPageName', steps[stepNumber].title);
	currentStep.value = stepNumber;
}

const setCurrentStep = () => {
	if (userStore.player) {
		/* Шаг 3 - Профиль игры */
		if (
				userStore.player.has_current_game ||
				(
						(userStore.player?.step_count === 0 || userStore.player?.finishBoard)
						&& userStore.player?.item_roll_count === 0
				)
		) {
			setStep(3); return;
		}

		/* Шаг 1 - Рулетка предметов */
		if (userStore.player?.item_roll_count > 0) { setStep(1); return; }

		/* Шаг 2 - Игровое поле */
		if (userStore.player?.step_count > 0) { setStep(2); return; }
	}
};

setCurrentStep();

const changeStep = (direction) => {
	switch (direction) {
		case 'next':
			const nextStep = currentStep.value + 1;

			if (steps[nextStep]) {
				setStep(nextStep);
			}
			break;
		case 'prev':
			const prevStep = currentStep.value - 1;

			if (steps[prevStep]) {
				setStep(prevStep);
			}
			break;
	}
}

/* Шаг 1 */
const tabsItemElements = [
	{
		id: 'inventory',
		title: 'Инвентарь',
	},
	{
		id: 'shop-items',
		title: 'Магазин Ксырстыка',
	},
	{
		id: 'item-list',
		title: 'Список предметов',
	},
];

/* Шаг 2 */

/* Шаг 3 */
const tabsGameElements = [
	{
		id: 'game',
		title: 'Профиль игры',
	},
	{
		id: 'game-list',
		title: 'Список игр',
	},
	{
		id: 'add-games',
		title: 'Добавление игр',
	},
];
</script>

<template>
	<div class="buttons">
		<div class="left">
			<button
					v-if="currentStep !== Number(firstStep())"
					class="btn btn-simple"
					@click="changeStep('prev')"
			><font-awesome-icon icon="fa-solid fa-arrow-left" /> Шаг назад</button>
		</div>

		<div class="center">
			<button
					v-for="(step, key) in steps"
					:key="key"
					:class="['btn btn-simple', currentStep === Number(key) ? 'active' : null]"
					@click="setStep(Number(key))"
			>
				{{ key }} - {{ step.buttonName }}
			</button>
		</div>

		<div class="right">
			<button
					v-if="currentStep !== Number(lastStep())"
					class="btn btn-simple ml-2"
					@click="changeStep('next')"
			>Шаг вперед <font-awesome-icon icon="fa-solid fa-arrow-right" /></button>
		</div>
	</div>

	<layout-InfoBlock
			v-if="currentStep"
			:text="steps[currentStep].description"
			classes="!mb-[1.5rem] mt-[1rem]"
	/>

	<div v-if="currentStep === 1">
		<Tabs
				:tabs="tabsItemElements"
				type="if"
				defaultCurrentTab="inventory"
		>
			<template #tab-inventory>
				<Inventory />
			</template>
			<template #tab-item-list>
				<ItemList />
			</template>
			<template #tab-shop-items>
				<Shop />
			</template>
		</Tabs>
	</div>
	<div v-if="currentStep === 2">
		<Board />
	</div>
	<div v-if="currentStep === 3">
		<Tabs
				:tabs="tabsGameElements"
				type="if"
				defaultCurrentTab="game"
		>
			<template #tab-game>
				<GameProfile @setStep="setStep($event)" />
			</template>
			<template #tab-game-list>
				<div class="max-w-[1400px] m-auto">
					<GameListWithPagination />
				</div>
			</template>
			<template #tab-add-games>
				<AddGames />
			</template>
		</Tabs>
	</div>
</template>

<style lang="scss" scoped>
.buttons {
	@apply w-full block lg:grid grid-cols-12 text-[1.2rem];

	.left {
		@apply col-span-4 flex justify-start;
	}

	.center {
		@apply col-span-4 flex justify-center;

		button {
			@apply mr-1;

			&.active {
				@apply bg-[var(--main-hover-color)];
			}
		}
	}

	.right {
		@apply col-span-4 flex justify-end;
	}
}
</style>
