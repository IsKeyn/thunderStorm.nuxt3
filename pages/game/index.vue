<script setup>
import EntertainmentEntityList from '@/components/entertainment/EntertainmentEntityList.vue';

const usedFilters = [
	{
		name: 'gamePlatforms',
		langName: 'Игровые платформы',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'genres',
		langName: 'Жанры',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'companies',
		langName: 'Компании',
		type: 'multiselect',
		requestData: true,
	},
	{
		name: 'series',
		langName: 'Серия',
		type: 'multiselect',
		requestData: true,
		parse: true,
	},
	{
		name: 'events',
		langName: 'Ивенты',
		type: 'multiselect',
		requestData: true,
		parse: true,
	},
	{
		name: 'tags',
		langName: 'Теги',
		type: 'curtained',
		requestData: true,
	},
];
</script>

<template>
	<EntertainmentEntityList
		entity="game"
		name="Игры"
		title="Игры"
		:usedFilters="usedFilters"
	/>
</template>
