<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import PlayerProfile from '@/modules/boardGame/components/user/player/PlayerProfile.vue';
import UserProfile from '@/components/user/profile/UserProfile.vue';

import {computed, inject} from 'vue'
const boardGameInfo = inject('boardGameInfo')

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

const route = useRoute();

const breadCrumbsArray = computed(() => {
	const splitPath = route.path.split('/');

	return [
		{
			name: boardGameInfo.value.name,
			href: `/${splitPath[1]}/${splitPath[2]}`,
		},
		{
			name: 'Профайл',
			href: `/${splitPath[1]}/${splitPath[2]}/${splitPath[3]}`,
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

const nameForProfile = computed(() => {
	if (route.params.name) {
		return route.params.name;
	} else if (isAuth) {
		return userStore.user.name;
	}
});
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
					:userName="nameForProfile"
			/>
		</template>
		<template #tab-2>
			<UserProfile />
		</template>
	</Tabs>
</template>
