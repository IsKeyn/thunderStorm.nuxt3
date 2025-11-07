<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import GameList from '@/modules/boardGame/components/game/GameList.vue';
import GameProfile from '@/modules/boardGame/components/game/GameProfile.vue';

const route = useRoute();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const pageName = 'Игра';
const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameStore.boardGameInfo?.name,
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
			:showMainPageInBreadCrumbs="false"
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
