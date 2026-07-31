<script setup>
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';

const emit = defineEmits(['toggleSellModal', 'sellItemFromEmit']);

import { bgItems } from '@/composables/boardGame/bgItems.js'
const { calcShopPrice } = bgItems();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { addTextToPoints } = boardGame();

const props = defineProps({
	item: {
		type: Object,
		default: {},
	},
});

const requestInProgress = false;

const sellItem = () => {
		const arg = {
			item: props.item,
			additionalParams: {}
		};

		emit('sellItemFromEmit', arg);
}
</script>

<template>
	<div v-if="Object.keys(item).length && item.item.item.price">
		<span class="inv-title">Вы собираетесь выставить на продажу предмет:</span>
		<ItemCard
				:element="item.item"
				:useLightBox="true"
				:showDropChance="false"
		/>

		<div class="item-box">
			Вы можете выставить свой предмет на продаже по цене {{ addTextToPoints(item.item.item.price) }}.
			Хозяин магазина Ксырстык добавит к цене свою долю и выставит предмет по цене {{ addTextToPoints(calcShopPrice(props.item.item.item.price)) }}.
			Если другой игрок купит предмет, вы получите {{ addTextToPoints(item.item.item.price) }}, остальное доля хозяина магазина.
			Вы можете разместит в магазине до 3-х предметов.
		</div>

		<span class="inv-title">Выставить на продажу?</span>
		<div class="button-box">
			<button
					class="btn btn-simple-1 mr-[8px]"
					@click="sellItem()"
			>
				Да
			</button>
			<button
					class="btn btn-simple-1 mr-[8px]"
					@click="emit('toggleSellModal')"
			>
				Нет
			</button>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Не получен предмет"
	/>
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

.item-box {
	@apply rounded-none;
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
