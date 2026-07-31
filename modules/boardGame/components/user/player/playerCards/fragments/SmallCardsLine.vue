<script setup>
import StatusEffectSmallCard from '@/modules/boardGame/components/statusEffect/StatusEffectSmallCard.vue';
import ItemSmallCard from '@/modules/boardGame/components/item/ItemSmallCard.vue';

import { computed } from "vue";

const props = defineProps({
	element: {
		type: Array,
		default: [],
	},
	/* statusEffect, items */
	type: {
		type: String,
		default: 'statusEffect',
	},
	classes: {
		type: String,
		default: 'elements',
	},
});

const showAll = ref(false);
const toggle = () => showAll.value = !showAll.value;

const groupedElements = computed(() => {
	const grouped = {};

	if (props.element) {
		props.element.forEach((el) => {
			if (props.type === 'statusEffect') {
				if (el.statusEffectBind) {
					if (grouped[el.statusEffectBind.id]) {
						grouped[el.statusEffectBind.id].statusEffectBind.quantity++;
					} else {
						grouped[el.statusEffectBind.id] = { ...el };
						grouped[el.statusEffectBind.id].statusEffectBind.quantity = 1;
					}
				}
			}

			if (props.type === 'items') {
				if (el.item) {
					if (grouped[el.item.id]) {
						grouped[el.item.id].item.quantity++;
					} else {
						grouped[el.item.id] = { ...el };
						grouped[el.item.id].item.quantity = 1;
					}
				}
			}
		});
	}

	return Object.values(grouped);
});

const elementsForShow = computed(() => {
	if (showAll.value) {
		return groupedElements.value;
	}

	if (groupedElements.value.length > 4) {
		return groupedElements.value.slice(0, 3);
	} else {
		return groupedElements.value;
	}
});
</script>

<template>
	<div
			v-if="groupedElements.length"
			:class="classes"
	>
		<StatusEffectSmallCard
				v-if="type === 'statusEffect'"
				v-for="(el, key) in elementsForShow"
				:key="key"
				:element="el?.statusEffectBind"
		/>
		<ItemSmallCard
				v-if="type === 'items'"
				v-for="(el, key) in elementsForShow"
				:key="key"
				:element="el?.item"
		/>
		<div
				v-if="groupedElements.length > 4"
				class="element-small-card-count"
				title="Показать все"
				@click.prevent="toggle()"
		>
			<template v-if="showAll">
				<font-awesome-icon icon="fa-solid fa-angles-right" />
			</template>
			<template v-else>
				+{{ groupedElements.length - 3 }}
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.elements {
	@apply lg:col-span-4 2xl:col-span-4 flex flex-wrap gap-1 justify-start lg:justify-end pl-3 pr-3 mt-4 lg:mt-0;
}

.element-small-card-count {
	@apply relative w-[60px] h-[60px] bg-[var(--third-block-color)] text-[1.5rem] text-[var(--main-dark-text-color)] flex items-center justify-center;

	border: 2px solid var(--third-block-color);
}
</style>
