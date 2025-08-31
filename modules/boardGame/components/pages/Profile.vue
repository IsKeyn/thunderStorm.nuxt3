<script setup>
import PlayerProfile from '@/modules/boardGame/components/user/player/PlayerProfile.vue';
import UserProfile from '@/components/user/profile/UserProfile.vue';
import Tabs from '@/components/ui/tabs/Tabs.vue';

import { inject } from 'vue'
const boardGameInfo = inject('boardGameInfo')

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const route = useRoute();

const breadCrumbsArray = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: boardGameInfo.value.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
		{
			name: 'Профайл',
			href: `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`,
		},
	];
});

if (route.params.name) {
	console.log('делаем запрос на получение конкретного пользователя, а лучше в компоненте');
}

const tabsElements = [
	{
		id: 1,
		title: 'Профиль участника',
	},
	{
		id: 2,
		title: 'Основной профиль',
	},
];
</script>

<template>
	<layout-PageHeader
			title="Профайл"
			:breadCrumbs="breadCrumbsArray"
	/>

	<Tabs
			:tabs="tabsElements"
			type="if"
	>
		<template #tab-1>
			<PlayerProfile
					:userInfo="userStore.player"
			/>
		</template>
		<template #tab-2>
			<UserProfile />
		</template>
	</Tabs>
</template>
