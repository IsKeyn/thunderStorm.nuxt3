<script setup>
import PlayerCard from '@/components/boardGame/user/PlayerCard.vue';

import { ref } from 'vue'

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Object,
		default: {},
	},
	players: {
		type: Object,
		default: {},
	},
});

const selectedOption = ref(null)
const isOpen = ref(false)

const toggleOptions = () => {
	isOpen.value = !isOpen.value
}

const selectOption = (option) => {
	selectedOption.value = option
	isOpen.value = false

	emit('update:modelValue', option);
}
</script>

<template>
	<div class="select-wrapper">
		<div
				class="selected"
				@click="toggleOptions"
		>
			<PlayerCard
					v-if="selectedOption"
					:element="selectedOption"
			/>
			<span v-else class="choice-player">Выберите игрока</span>
		</div>
		<div
				v-if="isOpen"
				class="options"
		>
			<div
					class="option"
					v-for="(player, key) in players.sort((a, b) => b.full_points - a.full_points)"
					:key="key"
			>
				<PlayerCard
						:element="player"
						@click="selectOption(player)"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.select-wrapper {
	@apply relative select-none;

	.selected {
		@apply pt-[10px] pb-[10px] cursor-pointer bg-[--main-block-color];

		.choice-player {
			@apply p-2 pr-[3rem] mb-2 bg-[var(--second-bg-color)] rounded flex relative cursor-pointer;
		}
	}

	.options {
		@apply
			absolute z-[10]
			w-full max-h-[20rem] overflow-auto
			bg-[--main-block-color]
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
