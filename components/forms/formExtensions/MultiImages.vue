<script setup>
import OpeningBox from '@/components/ui/OpeningBox.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	// Дополнительные данные для построения, например списку из сущности. Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC)
	additionalData: {
		type: Object,
		default: {},
	},
	params: {
		type: Object,
		default: {
			title: 'Обложки',
		},
	}
});

const repeaterItem = { // Один элемент репитора
	id: {
		name: 'Изображение',
		value: '',
		keyValueFromObject: 'id',
		objectValue: null,
		type: 'fileFromGallery',
		validateRules: '',
		classes: ['w-full', 'mt-[5px]'],
	},
};

const repeaterItems = ref ([]); // Массив с элементами репитора

const addRepeaterItem = () => {
	repeaterItems.value.push(structuredClone(repeaterItem));
}

const deleteRepeaterItem = (index) => {
	if (repeaterItems.value.length > 1) {
		repeaterItems.value = repeaterItems.value.filter((item, inx) => {
			if (index !== inx) {
				return item;
			}
		});

		setVmodel();
	}
}

const hasFirstLoad = ref(false);

const setVmodel = () => {
	const resultData = [];

	repeaterItems.value.forEach((item) => {
		const preparedObj = {};

		for (const key in item) {
			preparedObj[key] = item[key].value;
		}

		resultData.push(preparedObj);
	});

	emit('update:modelValue', resultData);
}

const updateItems = (currentValue) => {
	const countItemForClear = repeaterItems.value.length;

	if (currentValue && currentValue.length > 0) {
		currentValue.forEach((item) => {
			const preparedData = structuredClone(repeaterItem);

			for (const key in item) {
				if (preparedData[key]) {
					// Важное отличие
					preparedData[key].value = item[key];
					preparedData[key].objectValue = item;
				}
			}

			repeaterItems.value.push(preparedData);
		});

		hasFirstLoad.value = true;
	} else {
		repeaterItems.value.push(structuredClone(repeaterItem));
	}

	// Удаляем лишние элементы
	if (countItemForClear) {
		repeaterItems.value.splice(0, countItemForClear);
	}
}

watch(repeaterItems.value, () => {
	if (hasFirstLoad.value) {
		setVmodel();
	}
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
	if (!hasFirstLoad.value) {
		updateItems(toRaw(newValue));
	}
}, { deep: true });

watch(() => props.additionalData, (newValue) => {
	if (newValue && props.params?.additionalDataKeys) {
		props.params.additionalDataKeys.forEach((additionalKeys) => {
			if (newValue[additionalKeys]) {
				toRaw(newValue[additionalKeys]).forEach((item) => {
					repeaterItem[additionalKeys].options.push({
						name: item.name,
						value: item.id,
					});
				});
			}
		});
	}

	setVmodel();
	// updateItems(props.modelValue);
}, { deep: true });

updateItems(props.modelValue);
</script>


<template>
	<OpeningBox
			:title="params?.title"
	>
		<div class="release-date">
			<span class="form-title">Медиа в данной галерии</span>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					class="form"
			>
				<div
						v-for="(field, ind) in item"
						:key="ind"
						class="input-box"
				>
					<FormGenerator
							v-if="field"
							:name="field.name"
							:element="field"
							:showTitle="false"
							validateErrorPosition="bottom"
							fieldClasses="w-full"
					/>
				</div>
				<div class="buttons-box">
					<button
							v-if="repeaterItems.length > 1"
							class="btn btn-primary"
							@click="deleteRepeaterItem(index)"
					>
						<font-awesome-icon :icon="['fas', 'xmark']" />
					</button>
				</div>
			</div>
			<button
					class="btn btn-primary"
					@click="addRepeaterItem"
			>
				Добавить
			</button>
		</div>
	</OpeningBox>
</template>

<style lang="scss" scoped>
.release-date {
	@apply mt-[25px] mb-[25px];

	.form-title {
		@apply pb-[15px] block;
	}

	.form {
		@apply grid grid-cols-12 mb-[15px];

		.input-box {
			@apply col-span-10  mr-[15px];
		}

		.buttons-box {
			@apply col-span-2;

			.btn {
				@apply mt-0 mr-[3px] mb-0;
			}
		}
	}
}
</style>
