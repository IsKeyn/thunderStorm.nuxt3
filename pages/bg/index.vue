<script setup>
definePageMeta({
	layout: 'dashboard',
});

const menu = ref([
	{
		name: 'Главная',
		path: '/',
		icon: ['fas', 'house']
	},
	{
		name: 'Игроки',
		path: '/players',
		icon: ['fas', 'trophy']
	},
	{
		name: 'Доска',
		path: '/board',
		icon: ['fas', 'dice']
	},
	{
		name: 'Игры',
		path: '/games',
		icon: ['fas', 'gamepad']
	},
	{
		name: 'Предметы',
		path: '/items',
		icon: ['fas', 'hat-wizard']
	},
	{
		name: 'Настройки',
		path: '/settings',
		icon: ['fas', 'sliders']
	},
]);


</script>

<template>
	<div class="flex">
		<ui-SideMenu
				:menu="menu"
		/>
		<div class="w-full">
{{ fetchedData }}
		</div>
	</div>
</template>

<style>
main {
	margin-left: 60px; /* соответствует ширине свернутого меню */
	transition: margin-left 0.3s ease;
}

.sidebar--expanded + main {
	margin-left: 250px;
}
</style>
