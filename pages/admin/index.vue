<script setup>
definePageMeta({
	layout: 'admin',
});

import VersionList from '@/components/admin/version/VersionList.vue';

const titles = {
	id: {
		name: 'id',
		sortable: true,
		type: 'rounded-box',
	},
	entity_type: {
		name: 'Модель',
		sortable: true,
	},
	entity_id: {
		name: 'id элемента',
		sortable: true,
	},
	do_type: {
		name: 'Тип действия',
		sortable: true,
		type: 'rounded-box',
	},
	active: {
		name: 'Активность',
		type: 'boolean',
		sortable: true,
		classes: 'max-w-[30px]',
	},
	created_by: {
		name: 'Кем создан',
		type: 'EntityList',
		apiUrl: 'user/list',
		sortable: true,
	},
	created_at: {
		name: 'Дата создания',
		sortable: true,
	},
};
</script>

<template>
	<div>
		Главная страница админки
		<VersionList
				title="Список изменений"
				nullMessage="Изменения не найдены"
				requestUrl="admin/version"
				:titles="titles"
				:perPage="15"
				:perPageOptionsProp="[15, 30, 45]"
		/>
	</div>
</template>
