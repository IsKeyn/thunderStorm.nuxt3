<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import BigPreloader from '@/components/ui/BigPreloader.vue';
import GameListCard from '@/components/entertainment/card/GameListCard.vue';

import { computed, ref, watch } from "vue";

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Начните вводить название игры, для поиска',
				classes: 'w-full',
			},
			listType: {
				name: 'Тип списка',
				value: 0,
				type: 'select',
				options: [
					{
						name: 'Все списки',
						value: 0,
					},
					{
						name: 'Обычный список',
						value: 1,
					},
					{
						name: 'Золотая коллекция',
						value: 2,
					},
				],
			},
			platforms: {
				name: 'Игровая платформа',
				value: null,
				type: 'select',
				options: [],
			},
		},
);

const gameList = ref([]);
const platforms = ref({});
const dataByGroups = ref([]);
const filteredItems = ref(null);

const setPlatforms = () => {
	// Очищаем текущие платформы
	platforms.value = {};

	filteredItems.value.forEach((item) => {
		if (form.value.platforms.value === null) {
			platforms.value[item.platform.slug] = {
				id: item.platform.id,
				name: item.platform.name,
				sort: item.platform.sort,
				items: [],
			};
		} else if (form.value.platforms.value === item.platform.slug) {
			platforms.value[item.platform.slug] = {
				id: item.platform.id,
				name: item.platform.name,
				sort: item.platform.sort,
				items: [],
			};
		}
	});

	// 1. Получаем массив пар [key, value]
	const entries = Object.entries(platforms.value);

	// 2. Сортируем по полю `sort` (по возрастанию)
	const sortedEntries = entries.sort((a, b) => a[1].sort - b[1].sort);

	// 3. Собираем обратно в объект (в современных JS порядок сохранится)
	platforms.value = Object.fromEntries(sortedEntries);

	// Записываем платформы в select
	const options = [{
		name: 'Все платформы',
		value: null,
	}];

	for (let key in platforms.value) {
		options.push({
			name: platforms.value[key].name,
			value: key,
		});
	}

	if (form.value.platforms.options.length === 0) {
		form.value.platforms.options = options;
	}
}

const useFilter = () => {
	if (!fetchedData?.value) {
		return false;
	}

	filteredItems.value = fetchedData.value.filter((item) => {
		return item.game.name.toLowerCase().includes(form.value.searchLine.value ? form.value.searchLine.value.toLowerCase() : '');
	});

	filteredItems.value = fetchedData.value.filter((item) => {
		if (form.value.listType.value === 0) {
			return true;
		} else if (form.value.listType.value === 1) {
			return item.list_type === null;
		} else if (form.value.listType.value === 2) {
			return item.list_type === 1;
		}
	});

	filteredItems.value = filteredItems.value.sort((a, b) => {
		const dateA = a.game.release_dates[0]?.date;
		const dateB = b.game.release_dates[0]?.date;

		if (dateA && dateB) {
			return new Date(dateA) - new Date(dateB);
		}

		// Если у одного из элементов нет даты, размещаем его в конце
		if (!dateA && !dateB) return 0;
		if (!dateA) return 1;
		if (!dateB) return -1;

		return 0;
	});

	setPlatforms();

	const groups = platforms.value;

	filteredItems.value.forEach((item) => {
		if (item.platform.slug && groups[item.platform.slug]) {
			groups[item.platform.slug].items.push(item);
		}
	});

	dataByGroups.value = groups;
}

const requestName = 'bg_gameList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest('board-game/v2/game-list/list/', 'GET', { slug: route.params.slug }, requestName, '')
			);

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

watch(() => fetchedData.value, () => {
	useFilter();
}, { deep: true, immediate: true });

watch(form.value.searchLine, () => {
	useFilter();
}, { deep: true });

watch(form.value.listType, () => {
	useFilter();
}, { deep: true });

watch(form.value.platforms, () => {
	useFilter();
}, { deep: true });
</script>

<template>
	<BigPreloader
			v-if="requestInProgress"
			description="Формирование списка игр может потребовать времени, пожалуйста ожидайте"
	/>
	<template v-else>
		<div class="mb-4 lg:flex">
			<FormGenerator
					v-if="form.searchLine"
					name="search"
					:element="form.searchLine"
					class="w-full lg:w-1/2"
					:showTitle="false"
					:clearButton="true"
					validateErrorPosition="bottom"
					labelClasses="block lg:inline lg:mr-4 mt-[10px] mb-4 lg:mb-[10px]"
					:fieldClasses="form.searchLine.classes"
			/>
			<FormGenerator
					v-if="form.listType"
					name="listType"
					:element="form.listType"
					:showTitle="false"
					:clearButton="true"
					validateErrorPosition="bottom"
					labelClasses="lg:mr-4 mt-[10px] mb-4 lg:mb-[10px]"
					:fieldClasses="form.listType.classes"
			/>
			<FormGenerator
					v-if="form.platforms"
					name="listType"
					:element="form.platforms"
					:showTitle="false"
					:clearButton="true"
					validateErrorPosition="bottom"
					labelClasses="ml-4 lg:ml-0 lg:mr-4 mt-[10px] mb-4 lg:mb-[10px]"
					:fieldClasses="form.platforms.classes"
			/>
		</div>
		<div v-if="Object.keys(dataByGroups).length > 0">
			<div class="group" v-for="(group, key) in dataByGroups">
				<span class="title">{{ group.name }}</span>
				<div class="game-list">
					<GameListCard
							v-for="(item, index) in group.items"
							:key="key"
							:game="item.game"
							target="_blank"
							entity="game"
					/>
				</div>
			</div>
		</div>
		<div v-else class="item-box">
			Игр нет
		</div>
	</template>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex;
}

.group {
	@apply mb-10;
}

.game-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];
}
</style>
