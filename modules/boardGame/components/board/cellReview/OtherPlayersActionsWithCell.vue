<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import InEvent from '@/modules/boardGame/components/board/cellReview/fragments/InEvent.vue';
import InOtherEvents from '@/modules/boardGame/components/board/cellReview/fragments/InOtherEvents.vue';

import { ref } from "vue";

const props = defineProps({
	eventSlug: {
		type: String,
		default: null,
	},
	element: {
		type: Object,
		default: {},
		required: true,
	},
});

const tabsElements = ref([
	{
		id: 'inEvent',
		title: 'В текущем ивенте',
	},
	{
		id: 'inOtherEvents',
		title: 'В других ивентах',
	},
]);
</script>

<template>
	<span class="user-interface-title text-left">Отзывы игроков о данной ячейки игрового поля</span>
	<Tabs
			:tabs="tabsElements"
			defaultCurrentTab="inEvent"
			type="if"
	>
		<template #tab-inEvent>
			<InEvent
				:eventSlug="eventSlug"
				:element="element"
			/>
		</template>
		<template #tab-inOtherEvents>
			<InOtherEvents
					:eventSlug="eventSlug"
					:element="element"
			/>
		</template>
	</Tabs>
</template>

<style lang="scss" scoped />
