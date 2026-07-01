<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import InEvent from '@/modules/boardGame/components/game/otherPlayersActionsWithGame/fragments/InEvent.vue';
import InOtherEvents from '@/modules/boardGame/components/game/otherPlayersActionsWithGame/fragments/InOtherEvents.vue';

import { ref } from "vue";

const props = defineProps({
	eventSlug: {
		type: String,
		default: null,
	},
	gameSlug: {
		type: String,
		default: null,
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
	<span class="user-interface-title text-left">Действия игроков с данной игрой</span>
	<Tabs
			:tabs="tabsElements"
			defaultCurrentTab="inEvent"
			type="if"
	>
		<template #tab-inEvent>
			<InEvent
				:eventSlug="eventSlug"
				:gameSlug="gameSlug"
			/>
		</template>
		<template #tab-inOtherEvents>
			<InOtherEvents
					:eventSlug="eventSlug"
					:gameSlug="gameSlug"
			/>
		</template>
	</Tabs>
</template>

<style lang="scss" scoped>

</style>
