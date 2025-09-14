<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import Inventory from '@/modules/boardGame/components/item/Inventory.vue';
import ItemList from '@/modules/boardGame/components/item/ItemList.vue';

import { inject } from 'vue'
const boardGameInfo = inject('boardGameInfo')

const route = useRoute();

const pageName = 'Инвентарь';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameInfo.value.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: pageName,
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});

const tabsElements = [
	{
		id: 'inventory',
		title: 'Инвентарь',
	},
	{
		id: 'item-list',
		title: 'Список предметов',
	},
];
</script>

<template>
	<layout-PageHeader
			:title="pageName"
			:breadCrumbs="breadCrumbsArray"
	/>
	<Tabs
			:tabs="tabsElements"
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

</template>

<style lang="scss" scoped></style>
