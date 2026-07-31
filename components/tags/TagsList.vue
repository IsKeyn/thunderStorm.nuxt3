<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(['update:modelValue']);

import { computed, watch } from 'vue'

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { validate } from '@/composables/validate.js';
const { validateElement } = validate();

const props = defineProps({
	canAddTags: {
		type: Boolean,
		default: true,
	},
	modelValue: {
		type: Array,
		default: [],
	},
	type: {
		type: String,
		default: 'all',
	},
	fetchTags: {
		type: Boolean,
		default: true,
	},
	tags: {
		type: Array,
		default: [],
	},
	tagsCountForShowSearchLine: { // Минимальное количество тегов для отображения строки поиска
 		type: Number,
		default: 15,
	},
	tagsCountForShow: { // Количество тегов, которое отображается до строки "Показать ещё"
		type: Number,
		default: 40,
	},
});

const form = ref({
	search: {
		name: 'Поиск',
		value: '',
		type: 'text',
		placeholder: 'Начните вводите название тега',
		classes: ['w-full', 'mt-[5px]'],
	},
	tag: {
		name: 'Новый тег',
		value: '',
		type: 'text',
		placeholder: 'Название тега',
		validateRules: 'required, minLength_2, maxLength_40',
		classes: ['w-full', 'mt-[5px]'],
	},
});

const requestName = 'getTags';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.fetchTags) {
				const query = {};

				let requestUrl = 'tag/get';

				if (props.type) {
					requestUrl += `/${props.type}`;
				}

				const response = await Promise.resolve(
						sendApiRequest(requestUrl, 'GET', query, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);

const tagsList = ref([]);

const setTags = (tags, handlerType = 'new-list') => {
	if (handlerType === 'new-list') {
		tagsList.value = [];
	}

	const rawSelectedTags = toRaw(props.modelValue);

	tags.forEach((item) => {
		const selected = rawSelectedTags.includes(item.name);

		tagsList.value.push({
			id: item.id,
			name: item.name,
			selected,
		});
	});
}

watch(() => props.modelValue, (newValue) => {
	tagsList.value.forEach((item) => {
		item.selected = newValue.includes(item.name);
	});
}, { deep: true, immediate: true });

watch(() => fetchedData.value, () => {
	setTags(fetchedData.value);
}, { deep: true });

if (!props.fetchTags) {
	setTags(props.tags);

	watch(() => props.tags, (newValue) => {
		setTags(newValue);
	}, { deep: true });
}

const filteredTagsList = computed(() => {
	const arTags = [];

	tagsList.value.forEach((tag) => {
		arTags.push(tag.name.toLowerCase());
	});

	if (form.value.search.value) {
		return arTags.filter((tag) => tag.includes(form.value.search.value.toLowerCase()));
	} else {
		return arTags;
	}
});

const tagsForDisplay = computed(() => {
	return tagsList.value.filter((item) => filteredTagsList.value.includes(item.name.toLowerCase()));
});


const getTagClasses = (key) => {
	let classes = 'tag';

	if (tagsForDisplay.value[key].selected) {
		classes += ' selected';
	}

	return classes;
}

const toggleTag = (key) => {
	if (tagsForDisplay.value[key].new) {
		tagsForDisplay.value.splice(key, 1);
	} else {
		tagsForDisplay.value[key].selected = !tagsForDisplay.value[key].selected;
	}

	setSelectedTags();
}

const setSelectedTags = () => {
	const selectedTags = [];

	tagsForDisplay.value.forEach((item) => {
		if (item.selected) {
			selectedTags.push(item.name);
		}
	});

	emit('update:modelValue', selectedTags);
}

const addTag = () => {
	form.value.tag.validateResult = '';

	form.value.tag.validateResult = validateElement(form.value.tag.value, form.value.tag.validateRules);

	if (!form.value.tag.validateResult) {
		let hasTag = null;

		for (let i = 0; i < tagsList.value.length; i++) {
			if (tagsList.value[i].name.toLowerCase() === form.value.tag.value.toLowerCase()) {
				hasTag = i;
				break;
			}
		}

		if (hasTag === null) {
			tagsList.value.push({
				name: form.value.tag.value,
				selected: true,
				new: true,
			});
			form.value.tag.value = '';
		} else {
			form.value.tag.validateResult = 'Тег уже существует в списке, тег был выделен';
			tagsList.value[hasTag].selected = true;
		}

		setSelectedTags();
	}
}
</script>

<template>
	<div>
		<FormGenerator
				v-if="form.search && tagsCountForShowSearchLine <= tagsList.length"
				name="search"
				:element="form.search"
				:showTitle="false"
				:clearButton="true"
				wrapClasses="w-full md:w-3/12"
				labelClasses="mr-4"
				fieldClasses="w-full"
				:fieldClasses="form.searchclasses"
		/>
		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<div v-else>
			<ui-ShowMoreBlock
					v-if="tagsForDisplay.length"
					:names="{
							showMore: 'Показать больше',
							showLess: 'Показать меньше',
						}"
			>
				<template #default>
					<template v-for="(tag, key) in tagsForDisplay">
						<span
								v-if="key < tagsCountForShow"
								:class="[getTagClasses(key)]"
								@click="toggleTag(key)"
						>
							{{ tag.name }}
						</span>
					</template>
				</template>
				<template v-if="tagsForDisplay.length > tagsCountForShow" #hiddenContent>
					<template v-for="(tag, key) in tagsForDisplay">
						<span
								v-if="key >= tagsCountForShow"
								:class="[getTagClasses(key)]"
								@click="toggleTag(key)"
						>
							{{ tag.name }}
						</span>
					</template>
				</template>
			</ui-ShowMoreBlock>
			<ui-itemBox
					v-else
					classes="red"
			/>
		</div>
		<div v-if="canAddTags">
			<FormGenerator
					class="mt-4"
					name="tag"
					:element="form.tag"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['inline-block', 'mb-[10px]', 'mr-2']"
					:fieldClasses="form.tag.classes"
			/>
			<button class="btn btn-primary" @click="addTag">Добавить</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.street-light-theme {
	.tag {
		@apply text-[var(--main-text-color)];
	}
}
</style>
