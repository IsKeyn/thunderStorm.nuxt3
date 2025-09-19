<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import GameList from '@/modules/boardGame/components/game/GameList.vue';
import GameProfile from '@/modules/boardGame/components/game/GameProfile.vue';

import { inject } from 'vue'
const boardGameInfo = inject('boardGameInfo')

const route = useRoute();

const pageName = 'Игра';
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
	<layout-PageHeader
			:title="pageName"
			:breadCrumbs="breadCrumbsArray"
	/>
	<Tabs
			:tabs="tabsElements"
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

</template>

<style lang="scss" scoped></style>
