<script setup>
import { ref } from "vue";

const route = useRoute();

const menu = computed(() => {
	return [
		{
			name: 'Главная',
			path: '/e/' + route.params.slug + '/',
			icon: ['fas', 'house']
		},
		{
			name: 'Игроки',
			path: '/e/' + route.params.slug + '/player/',
			icon: ['fas', 'trophy']
		},
		{
			name: 'Доска',
			path: '/board',
			icon: ['fas', 'dice']
		},
		{
			name: 'Игра',
			path: '/e/' + route.params.slug + '/game/',
			icon: ['fas', 'gamepad']
		},
		{
			name: 'Инвентарь',
			path: '/e/' + route.params.slug + '/inventory/',
			icon: ['fas', 'hat-wizard']
		},
		{
			name: 'Настройки',
			path: '/settings',
			icon: ['fas', 'sliders']
		},
		{
			name: 'Расширенные',
			path: '/e/' + route.params.slug + '/log-list/',
			icon: ['fa-solid', 'fa-arrow-up-right-from-square'],
			group: [
				{
					name: 'Логи',
					path: '/e/' + route.params.slug + '/log-list/',
					icon: ['fa-solid', 'fa-rectangle-list'],
				},
				{
					name: 'Обсуждение',
					path: '/e/' + route.params.slug + '/discussion/',
					icon: ['fa-solid', 'fa-message']
				},
			],
		},
		{
			name: 'Статистика',
			path: '/e/' + route.params.slug + '/stats/',
			icon: ['fas', 'chart-pie']
		},
	]
});
</script>

<template>
	<ui-SideMenu
			:menu="menu"
			widthClass="width250"
	/>
</template>
