<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [
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
			entity="movie"
			name="Фильмы"
			title="Фильмы"
			:usedFilters="usedFilters"
	/>
</template>
