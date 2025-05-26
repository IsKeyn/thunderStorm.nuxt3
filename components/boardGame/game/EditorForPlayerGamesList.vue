<script setup>
import EditGameListCard from '@/components/boardGame/game/EditGameListCard.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';

import { watch } from "vue";

const emit = defineEmits(['editListToggle', 'updateBoardGameInfo', 'refreshGameList']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	items: {
		type: Array,
		default: [],
	},
});

const filteredItems = ref(props.items);

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Начните вводить название игры, для фильтрации...',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

const filterByListForm = ref(
		{
			list: {
				name: 'Список',
				value: '',
				type: 'textarea',
				placeholder: '',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);


watch(() => props.items, () => {
	useFilter();
}, { deep: true });

watch(form.value.searchLine, () => {
	useFilter();
}, { deep: true });

const platforms = ref({});

const setPlatforms = () => {
	props.items.forEach((item) => {
		platforms.value[item.platform.slug] = {
			id: item.platform.id,
			name: item.platform.name,
			sort: item.platform.sort,
		};
	});

	// 1. Получаем массив пар [key, value]
	const entries = Object.entries(platforms.value);

	// 2. Сортируем по полю `sort` (по возрастанию)
	const sortedEntries = entries.sort((a, b) => a[1].sort - b[1].sort);

	// 3. Собираем обратно в объект (в современных JS порядок сохранится)
	platforms.value = Object.fromEntries(sortedEntries);
}

setPlatforms();

const selectedPlatform = ref(null);

watch(selectedPlatform, () => {
	useFilter();
}, { deep: true });

const useFilter = () => {
	let gamesArray = [];

	if (filterByListForm.value.list.value) {
		gamesArray = filterByListForm.value.list.value.split('\n')
				.map(game => game.trim())
				.filter(game => game.length > 0)
				.map(game => game.replace(/\s*\(.*?\)\s*$/, ''));
	}

	filteredItems.value = props.items.filter((item) => {
		if (selectedPlatform.value !== null) {
			return item.platform.id === selectedPlatform.value;
		} else {
			return true;
		}
	}).filter((item) => {
		return item.game.name.toLowerCase().includes(form.value.searchLine.value.toLowerCase());
	}).filter((item) => {
		return !gamesArray.includes(item.game.name.replace(/\s*\(.*?\)\s*$/, ''));
	});
}

const clearAllFilters = () => {
	selectedPlatform.value = null;
	filterByListForm.value.list.value = '';
	form.value.searchLine.value = '';
	useFilter();
}
</script>

<template>
	<button class="btn btn-simple-1 mr-2" @click="emit('editListToggle')"><font-awesome-icon :icon="['fas', 'arrow-left']" /> Назад</button>
	<button class="btn btn-simple-1 mr-2" @click="clearAllFilters()">Очистить все фильтры</button>
	<div v-if="items.length > 0">
		<div class="flex mb-2">
			<FormGenerator
					v-if="form.searchLine"
					name="name"
					class="w-1/2"
					:element="form.searchLine"
					:showTitle="false"
					validateErrorPosition="bottom"
					labelClasses="mr-4 mt-[10px] mb-[10px]"
					:fieldClasses="form.searchLine.classes"
			/>
			<select
					v-model="selectedPlatform"
					class="mb-[10px] pb-0 pr-[10px]"
			>
				<option :value="null">Все платформы</option>
				<option
						v-for="(platform, key) in platforms"
						:key="key"
						:value="platform.id"
				>
					{{ platform.name }}
				</option>
			</select>
			<div class="count-info">
				Найдено игр: {{ filteredItems.length }}
			</div>
		</div>
		<OpeningBox
				title="Фильтрация по списку"
		>
			<div class="item-box">
				Вы можете вставить в поле ниже свой список игр из RGG Roll. В этом случае в списке останутся игры, которые вы исключили из своего списка RGG Roll. То есть рерольнутые, пройденные или отданные игры.
				Для вставки списка, нажмите правой кнопкой мыши на "Кот в мешке", выделите весь список, скопируйте и вставьте в поле ниже.
				<br>
				Обязательно проверьте список, что вы обработали все игры, которые прошли, рерольнули или отдали.
			</div>
			<FormGenerator
					v-if="filterByListForm.list"
					name="name"
					class="w-1/2"
					:element="filterByListForm.list"
					:showTitle="false"
					validateErrorPosition="bottom"
					labelClasses="mr-4 mt-[10px] mb-[10px]"
					:fieldClasses="filterByListForm.list.classes"
			/>
			<button class="btn btn-simple-1" @click="useFilter()">Фильтровать</button>
		</OpeningBox>

		<EditGameListCard
				v-for="(item, key) in filteredItems"
				:key="key"
				:item="item"
				:boardGameId="boardGameId"
				@updateBoardGameInfo="emit('updateBoardGameInfo')"
				@refreshGameList="emit('refreshGameList')"
		/>
	</div>
	<div v-else class="item-box">
		Игр нет
	</div>
</template>

<style lang="scss" scoped>
.count-info {
	@apply pt-[1rem] pl-[1rem];
}
</style>
