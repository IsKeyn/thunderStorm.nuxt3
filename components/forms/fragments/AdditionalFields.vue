<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	defaultValues: {
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
		default: {},
	},
});

const repeaterItem = { // Один элемент репитора
	id: {
		name: 'id',
		value: '',
		type: 'hidden',
		validateRules: null,
		classes: ['w-full', 'mt-[5px]'],
	},
	name: {
		name: 'Название',
		value: '',
		type: 'text',
		placeholder: 'Название',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
	},
	slug: {
		name: 'Slug',
		value: '',
		type: 'text',
		placeholder: 'slug',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
		autoFill: {
			sourceFieldKey: 'name',
			rule: 'slug',
		},
	},
	value: {
		name: 'Значение',
		value: '',
		type: 'text',
		placeholder: 'Значение',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
	},
	sort: {
		name: 'Сортировка',
		value: '',
		type: 'number',
		placeholder: 'Сортировка',
		validateRules: 'required, minLength_3, maxLength_255',
		classes: ['w-full', 'mt-[5px]'],
	},
};

const repeaterComponent = ref(null);
const repeaterItems = ref([]);

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
	dontChangeVModel.value = true;

	if (currentValue && currentValue.length > 0) {
		fillRepeaterItems(currentValue);
	} else if (props.defaultValues && props.defaultValues.length > 0) { // Заполняем дефолтные значения
		fillRepeaterItems(props.defaultValues);
	}
}

const fillRepeaterItems = (items) => {
	let finishAr = [];

	items.forEach((item) => {
		const preparedData = structuredClone(repeaterItem);

		for (const key in item) {
			if (preparedData[key]) {
				// Важное отличие
				preparedData[key].value = item[key];
				preparedData[key].objectValue = item;
			}
		}

		finishAr.push(preparedData);
	});

	repeaterItems.value = finishAr;
}

const dontChangeRepeaterItems = ref(false);
const dontChangeVModel = ref(false);

watch(() => props.modelValue, (newValue) => {
	if (!dontChangeRepeaterItems.value) {
		updateItems(toRaw(newValue));
	} else {
		dontChangeRepeaterItems.value = false;
	}
}, { deep: true, immediate: true });

watch(() => repeaterItems.value, () => {
	if (!dontChangeVModel.value) {
		dontChangeRepeaterItems.value = true;
		setVmodel();
	} else {
		dontChangeVModel.value = false;
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
	updateItems(props.modelValue);
}, { deep: true });
</script>

<template>
	<div class="repeater-form-box">
		<span class="form-title">Дополнительные поля</span>
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="repeaterItem"
				v-model="repeaterItems"
				#default="{ repeaterItems, reload }"
		>
			<div
					v-for="(element, index) in repeaterItems"
					:key="index"
					class="form"
			>
				<div
						v-for="(field, ind) in element"
						:key="ind"
						:class="field.type === 'hidden' ? 'hidden' : 'input-box'"
				>
					<FormGenerator
							v-if="field"
							:name="field.name"
							:element="field"
							:form="element"
							:showTitle="false"
							validateErrorPosition="bottom"
							fieldClasses="w-full"
					/>
				</div>
				<div class="buttons-box">
					<button
							v-if="repeaterItems.length > 1"
							class="btn btn-primary"
							@click="repeaterComponent.deleteRepeaterItem(index)"
					>
						<font-awesome-icon :icon="['fas', 'xmark']" />
					</button>
				</div>
			</div>
			<button
					class="btn btn-primary block"
					@click="repeaterComponent.addRepeaterItem()"
			>
				Добавить
			</button>
		</Repeater>
	</div>
</template>

<style lang="scss" scoped>
.repeater-form-box {
	@apply mt-[25px] mb-[25px];

	.form-title {
		@apply pb-[15px] block;
	}

	.form {
		@apply grid grid-cols-12 mb-[15px];

		.input-box {
			@apply col-span-2  mr-[15px];
		}

		.buttons-box {
			@apply col-span-1;

			.btn {
				@apply mt-0 mr-[3px] mb-0;
			}
		}
	}
}
</style>
