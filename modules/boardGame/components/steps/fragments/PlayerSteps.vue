<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';

import Inventory from '@/modules/boardGame/components/item/Inventory.vue';
import ItemList from '@/modules/boardGame/components/item/ItemList.vue';
import Board from '@/modules/boardGame/components/board/Board.vue';
import GameList from '@/modules/boardGame/components/game/GameList.vue';
import GameProfile from '@/modules/boardGame/components/game/GameProfile.vue';

const emit = defineEmits(['setPageName']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const steps = ref({
	1: {
		title: 'Действие 1 - Лут предметов и их использование',
		description: 'Прокрутите рулетку предметов доступное количество раз, ознакомтесь с выпавшими предметами и при необходимости используйте их',
	},
	2: {
		title: 'Действие 2 - Игровая доска, ход и действия на клетках',
		description: 'Бросьте кубик, если вы попадете на клетку с действием, примите решение с действием',
	},
	3: {
		title: 'Действие 3 - Выбор игры и её прохождение',
		description: 'Крутаните рулетку игр и выберите игру для прохождения, помните, что рерол игры накладывает штрафы. Вы время прохождения игры необходимо включать таймер',
	},
});

const firstStep = computed(() => {
	return Object.keys(steps.value)[0];
});

const lastStep = computed(() => {
	const keys = Object.keys(steps.value);
	return keys[keys.length - 1];
});

const currentStep = ref(1);

const setCurrentStep = () => {
	if (userStore.player) {
		/* Шаг 1 - Рулетка предметов */
		if (userStore.player?.item_roll_count > 0) {
			const stemNumber = 1;
			emit('setPageName', steps.value[stemNumber].title)
			return stemNumber;
		}

		if (userStore.player?.dice_roll_count > 0) {
			const stemNumber = 2;
			emit('setPageName', steps.value[stemNumber].title)
			return stemNumber;
		}

		if (userStore.player.current_game) {
			const stemNumber = 3;
			emit('setPageName', steps.value[stemNumber].title)
			return stemNumber;
		}
	}
};

setCurrentStep();

const changeStep = (direction) => {
	switch (direction) {
		case 'next':
			const nextStep = currentStep.value + 1;

			if (steps.value[nextStep]) {
				currentStep.value = nextStep;
			}
			break;
		case 'prev':
			const prevStep = currentStep.value - 1;

			if (steps.value[prevStep]) {
				currentStep.value = prevStep;
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
];
</script>

<template>
	<layout-InfoBlock
			v-if="currentStep"
			:text="steps[currentStep].description"
			classes="mb-6"
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
				<GameProfile />
			</template>
			<template #tab-game-list>
				<div class="max-w-[1400px] m-auto">
					<GameList />
				</div>
			</template>
		</Tabs>
	</div>

	<div class="text-center mt-6">
		<button
				v-if="currentStep !== Number(firstStep)"
				class="btn btn-simple mr-2"
				@click="changeStep('prev')"
		><font-awesome-icon icon="fa-solid fa-arrow-left" /> Шаг назад</button>
		<button
				v-if="currentStep !== Number(lastStep)"
				class="btn btn-simple"
				@click="changeStep('next')"
		>Шаг вперед <font-awesome-icon icon="fa-solid fa-arrow-right" /></button>
	</div>
</template>

<style lang="scss" scoped>
.info-box {
	@apply rounded-none;
}
</style>
