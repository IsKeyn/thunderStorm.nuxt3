<script setup>
import { helper } from '@/composables/helper.js'
const { route } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

const menu = computed(() => {
	const returnData = [];

	returnData.push(
			{
				name: 'Действия',
				path: '/e/' + route.params.slug + '/',
				icon: ['fas', 'house']
			}
	);

	const aboutGroup = [
		{
			name: 'Игры',
			path: '/e/' + route.params.slug + '/game/',
			icon: ['fas', 'gamepad']
		},
		{
			name: 'Игровое поле',
			path: '/e/' + route.params.slug + '/board/',
			icon: ['fas', 'dice']
		},
		{
			name: 'Предметы в ивенте',
			path: '/e/' + route.params.slug + '/inventory/',
			icon: ['fas', 'hat-wizard']
		},
		{
			name: 'Правила и описание',
			path: '/e/' + route.params.slug + '/rules/',
			icon: ['fas', 'book-open-reader'],
		},
	];

	const eventOrganizersSetting = getSettingValue('event_organizers');

	if (eventOrganizersSetting) {
		aboutGroup.push({
			name: 'Организаторы и благодарности',
			path: '/e/' + route.params.slug + '/organizers_and_gratitude/',
			icon: ['fa-solid', 'fa-people-group'],
		});
	}

	returnData.push(
		{
			name: 'Об ивенте',
			icon: ['fa-brands', 'fa-readme'],
			group: aboutGroup,
		}
	);

	returnData.push(
		{
			name: 'Участники',
			path: '/e/' + route.params.slug + '/player/',
			icon: ['fas', 'trophy']
		},
		{
			name: 'Взаимодействия',
			path: '/e/' + route.params.slug + '/player-interactions/',
			icon: ['fa-solid', 'fa-people-group']
		},
		{
			name: 'Дополнительно',
			path: '/e/' + route.params.slug + '/log-list/',
			icon: ['fa-solid', 'fa-arrow-up-right-from-square'],
			group: [
				{
					name: 'Таймеры',
					path: '/e/' + route.params.slug + '/timers/',
					icon: ['fa-solid', 'fa-stopwatch'],
				},
				{
					name: 'Обсуждение',
					path: '/e/' + route.params.slug + '/discussion/',
					icon: ['fa-solid', 'fa-message']
				},
				{
					name: 'Логи',
					path: '/e/' + route.params.slug + '/log-list/',
					icon: ['fa-solid', 'fa-rectangle-list'],
				},
			],
		},
		{
			name: 'Статистика',
			path: '/e/' + route.params.slug + '/stats/',
			icon: ['fas', 'chart-pie']
		}
	);

	return returnData;
});
</script>

<template>
	<ui-SideMenu
			:menu="menu"
			widthClass="width350"
	/>
</template>
