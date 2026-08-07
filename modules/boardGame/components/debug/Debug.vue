<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import BoardDebug from '@/modules/boardGame/components/debug/BoardDebug.vue';
import ItemDebug from '@/modules/boardGame/components/debug/ItemDebug.vue';
import StatusEffectDebug from '@/modules/boardGame/components/debug/StatusEffectDebug.vue';

import { ref } from "vue";

const tabsElements = ref([
	{
		id: 'items',
		title: 'Предметы',
	},
	{
		id: 'status-effects',
		title: 'Статус эффекты',
	},
	{
		id: 'board',
		title: 'Игровое поле',
	},
]);
</script>

<template>
	<Tabs
			:tabs="tabsElements"
			defaultCurrentTab="items"
			type="if"
	>
		<template #tab-items>
			<ItemDebug />
		</template>
		<template #tab-status-effects>
			<StatusEffectDebug />
		</template>
		<template #tab-board>
			<BoardDebug />
		</template>
	</Tabs>
</template>

<style lang="scss" scoped>

</style>
