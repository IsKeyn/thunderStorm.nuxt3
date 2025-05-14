<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';

import {ref, watch} from 'vue'

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
			<ItemCard
					v-if="selectedOption && selectedOption.item"
					:element="selectedOption.item"
			/>
			<span v-else class="choice-player">
				<template v-if="items.length === 0">
					Предметов нет!
				</template>
				<template v-else>
					Выберите предмет
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
				<ItemCard
						:element="item.item"
						@click="selectOption(item)"
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
