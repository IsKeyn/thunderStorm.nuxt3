<script setup>
import StatusEffectCard from '@/modules/boardGame/components/statusEffect/StatusEffectCard.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';

import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Object,
		default: {},
	},
	items: {
		type: Object,
		default: [],
	},
});

const selectedOption = ref(null);
const isOpen = ref(false);

const toggleOptions = () => {
	isOpen.value = !isOpen.value
}

const selectOption = (option) => {
	selectedOption.value = option
	isOpen.value = false

	emit('update:modelValue', option);
}

watch(() => props.modelValue, (newValue) => {
	selectedOption.value = props.modelValue;
}, { deep: true });
</script>

<template>
	<div class="select-wrapper">
		<div
				class="selected"
				@click="toggleOptions"
		>
			<div v-if="selectedOption" :style="`height: ${90 - 5}px;`">
				<GameGamblingCard
						:itemHeight="90"
						:element="selectedOption"
				/>
			</div>
			<span v-else class="choice-player">
				<template v-if="items.length === 0">
					Игр нет!
				</template>
				<template v-else>
					Выберите игру
				</template>
			</span>
		</div>
		<div
				v-if="isOpen"
				class="options"
		>
			<div
					class="option"
					v-for="(item, key) in items"
					:key="key"
			>
				<div :style="`height: ${90 - 5}px;`" class="mb-1">
					<GameGamblingCard
							:element="item"
							:itemHeight="90"
							@click="selectOption(item)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.select-wrapper {
	@apply relative select-none;

	.selected {
		@apply pt-[10px] pb-[10px] cursor-pointer bg-[var(--third-bg-color)];

		.choice-player {
			@apply p-2 pr-[3rem] mb-2 bg-[var(--second-bg-color)] rounded flex relative cursor-pointer;
		}
	}

	.options {
		@apply
			absolute z-[10]
			w-full max-h-[20rem] overflow-auto
			bg-[var(--third-bg-color)]
		;

		.option {
			@apply
				pr-[10px] pl-[10px]
				cursor-pointer
			;

			&:hover {}
		}
	}
}
</style>
