<script setup>
import { watch } from 'vue'

import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

// const modelValue = defineModel();

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
});


watch(() => props.modelValue, (newValue) => {
	tagsList.value.forEach((item) => {
		item.selected = newValue.includes(item.name);
	});
}, { deep: true });

const tagsList = ref([]);

const form = ref({
	tag: {
		name: 'Новый тег',
		value: '',
		type: 'text',
		validateRules: 'required, minLength_2, maxLength_40',
		classes: ['w-full', 'mt-[5px]'],
	},
});

const setTags = (tags, handlerType = 'new-list') => {
	if (handlerType === 'new-list') {
		tagsList.value = [];
	}

	tags.forEach((item) => {
		const selected = toRaw(props.modelValue).includes(item.name);

		tagsList.value.push({
			name: item.name,
			selected,
		});
	});
}

// Получаем с бека теги
import { api } from '@/composables/api.js'
const { apiUrl } = api();

const Authorization = useCookie('Authorization');

const fetchedData = ref('');

await useAsyncData(
		'tags',
		async () => {
			if (props.fetchTags) {
				let request = `${apiUrl.value}tag/get`;

				if (props.type) {
					request += `/${props.type}`;
				}

				await $fetch(
						request,
						{
							method: 'GET',
							headers: {
								Authorization: Authorization.value,
								Accept: 'application/json',
								'X-Requested-With': 'XMLHttpRequest',
							},
							onResponse({response}) {
								if (response.status === 200) {
									fetchedData.value = response._data.data;

									// Данный select не отрабатывает (в большинстве случаев), так как данные props.modelValue ещё не получены от бека на данном этапе
									setTags(fetchedData.value);
								}
							}
						},
				)
			}
		}
)

if (!props.fetchTags) {
	setTags(props.tags);

	watch(() => props.tags, (newValue) => {
		setTags(newValue);
	}, { deep: true });
}

//
// const fetchedData = ref();
//
// let request = `${apiUrl.value}tag/get`;
//
// if (props.type) {
// 	request += `/${props.type}`;
// }
//
// await useFetch(
// 		request,
// 		{
// 			method: 'GET',
// 			headers: {
// 				Authorization: Authorization.value,
// 				Accept: 'application/json',
// 				'X-Requested-With': 'XMLHttpRequest',
// 			},
// 		},
// ).then((response) => {
// 	if (response.status.value === 'success') {
// 		fetchedData.value = toRaw(response.data.value).data;
//
// 		if (fetchedData.value) {
// 			fetchedData.value.forEach((item) => {
// 				// Данный select не отрабатывает (в большинстве случаев), так как данные props.modelValue ещё не получены от бека на данном этапе
// 				const selected = toRaw(props.modelValue).includes(item.name);
//
// 				tagsList.value.push({
// 					name: item.name,
// 					selected,
// 				});
// 			});
// 		}
// 	}
// });

const getTagClasses = (key) => {
	let classes = 'tag';

	if (!filteredTagsList.value.includes(tagsList.value[key].name.toLowerCase())) {
		classes += ' !hidden';
	}

	if (tagsList.value[key].selected) {
		classes += ' selected';
	}

	return classes;
}

const emit = defineEmits(['update:modelValue']);

const toggleTag = (key) => {
	if (tagsList.value[key].new) {
		tagsList.value.splice(key, 1);
	} else {
		tagsList.value[key].selected = !tagsList.value[key].selected;
	}

	setVmodel();
}

const setVmodel = () => {
	const vmodel = [];

	tagsList.value.forEach((item) => {
		if (item.selected) {
			vmodel.push(item.name);
		}
	});

	emit('update:modelValue', vmodel);
}

import { validate } from '@/composables/validate.js';
const { validateElement, validateForm  } = validate();

const addTag = () => {
	for (const formKey in form.value) {
		form.value[formKey].validateResult = '';
	}

	const { status, key, validateResult } = validateForm(form.value);

	if (status) {
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

		setVmodel();
	} else {
		form.value[key].validateResult = validateResult;
	}
}

const search = ref({
	name: 'Поиск',
	value: '',
	type: 'text',
	placeholder: 'Вводите название тега',
	classes: ['w-full', 'mt-[5px]'],
});

const filteredTagsList = computed(() => {
	const arTags = [];

	tagsList.value.forEach((tag) => {
		arTags.push(tag.name.toLowerCase());
	});

	if (search.value.value) {
		return arTags.filter((tag) => {
			return tag.includes(search.value.value.toLowerCase());
		});
	} else {
		return arTags;
	}
});
</script>

<template>
	<div>
		<FormGenerator
				v-if="search && tagsCountForShowSearchLine <= tagsList.length"
				name="search"
				:element="search"
				:showTitle="true"
				:clearButtom = "true"
				wrapClasses="w-full md:w-3/12"
				labelClasses="mr-4"
				:fieldClasses="search.classes"
		/>
		<div>
			<span
					v-for="(tag, key) in tagsList"
					:class="[getTagClasses(key)]"
					@click="toggleTag(key)"
			>
				{{ tag.name }}
			</span>
		</div>
		<div v-if="canAddTags">
			<FormGenerator
					v-for="(field, index) in form"
					:key="index"
					:name="index"
					:element="field"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['inline-block', 'mb-[10px]', 'mr-2']"
					:fieldClasses="field.classes"
			/>
			<button class="btn btn-primary" @click="addTag">Добавить</button>
		</div>
	</div>
</template>
