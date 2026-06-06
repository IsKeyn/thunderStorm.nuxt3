<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [
	{
		name: 'minMaxData',
		langName: 'Дата выхода',
		requestData: true,
	},
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

const sortOptions = [
	{
		name: 'Сортировка',
		value: 'sort',
	},
	{
		name: 'Название',
		value: 'name',
	},
	{
		name: 'Лайки',
		value: 'likes',
	},
	{
		name: 'Просмотры',
		value: 'views',
	},
	{
		name: 'Дата релиза',
		value: 'date',
	},
	{
		name: 'Дата публикации',
		value: 'created_at',
	},
];
</script>

<template>
	<List
		entity="game"
		name="Игры"
		title="Игры"
		:usedFilters="usedFilters"
		:sortOptions="sortOptions"
	/>
</template>
