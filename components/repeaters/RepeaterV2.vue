<script setup>
import { watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	repeaterItem: {
		type: Object,
		default: {},
	},
	/*
	 * Дополнительные данные для построения репитора, например списку из сущности.
	 * Пример селектор для игровых платформ: PS1, PS2, XBOX ... PC
	 */
	additionalData: {
		type: Object,
		default: {},
	},
	/*
	 * Параметры
	 * additionalDataKeys - ключи ключей дополнительных данных (additionalData)
	 */
	params: {
		type: Object,
		default: {},
	},
	defaultValues: {
		type: Array,
		default: [],
	},
	/*
	 * Если данные обновляются через watch в родителе, то необходимо убрать дублирующее
	 * обновление данных в этом компоненте, пример AdditionalFields
	 */
	parentComponentUpdateData: {
		type: Boolean,
		default: false,
	},
	/* Записывать в модель только value значение, по умолчанию false и при отсуствии значения записывается объект */
	onlyValue: {
		type: Boolean,
		default: false,
	},
	/* Записываем значение сортировки */
	setSort: {
		type: Boolean,
		default: false,
	},
});

const {
	repeaterItems,
	fillAdditionalData,
	updateItems,
	addRepeaterItem,
	copyRepeaterItem,
	deleteRepeaterItem,
	setValue,
} = repeater();

defineExpose({
	addRepeaterItem,
	copyRepeaterItem,
	deleteRepeaterItem,
	updateItems,
});

fillAdditionalData();
updateItems(props.modelValue);

function repeater() {
	const repeaterItems = ref([]); // Массив с элементами репитора

	const hasFileFromGallery = computed(() => {
		let returnData = false;

		for (let key in props.repeaterItem) {
			if (props.repeaterItem[key] === 'fileFromGallery') {
				returnData = true;
				break;
			}
		}

		return returnData;
	});

	const fillAdditionalData = () => {
		if (props.additionalData && props.params?.additionalDataKeys) {
			props.params.additionalDataKeys.forEach((additionalKeys) => {
				if (props.additionalData[additionalKeys]) {
					toRaw(props.additionalData[additionalKeys]).forEach((item) => {
						props.repeaterItem[additionalKeys].options.push({
							name: item.name,
							value: item.id,
						});
					});
				}
			});
		}
	}

	const updateItems = (currentValue) => {
		const countItemForClear = repeaterItems.value.length;

		if (currentValue && currentValue.length > 0) {
			fillRepeaterItems(currentValue);
		} else if (props.defaultValues && props.defaultValues.length > 0) { // Заполняем дефолтные значения
			fillRepeaterItems(props.defaultValues);
		} else {
			repeaterItems.value.push(structuredClone(props.repeaterItem));
		}

		/*
		 * Удаляем лишние элементы (элементы, которые были до добавления новых значений, своебразное решение, но приходится
		 * к нему прибегать, чтобы не потерять реактивность
		 */
		if (countItemForClear) {
			repeaterItems.value.splice(0, countItemForClear);
		}
	}

	const fillRepeaterItems = (items) => {
		items.forEach((item, index) => {
			let preparedData = structuredClone(props.repeaterItem);

			if (Object.keys(props.repeaterItem).length > 0) {
				for (const key in item) {

					if (preparedData.hasOwnProperty(key)) {
						if (preparedData[key].hasOwnProperty('value')) {
							preparedData[key].value = item[key];
						} else {
							preparedData[key] = item[key];
						}
					}
				}

				// Заполнение objectValue необходимо только для типов fileFromGallery
				if (hasFileFromGallery.value && typeof preparedData['objectValue'] !== "undefined") {
					preparedData.objectValue = item;
				}
			} else {
				preparedData = item;
			}

			if (props.setSort) {
				preparedData.sort = index;
			}

			repeaterItems.value.push(preparedData);
		});
	}

	const addRepeaterItem = () => {
		repeaterItems.value.push(structuredClone(props.repeaterItem));

		if (props.setSort) {
			repeaterItems.value[repeaterItems.value.length - 1].sort = repeaterItems.value.length - 1;
		}

		if (props.parentComponentUpdateData) {
			setValue();
		}
	}

	const copyRepeaterItem = (index) => {
		repeaterItems.value.push(structuredClone(toRaw(repeaterItems.value[index])));

		if (props.setSort) {
			repeaterItems.value[repeaterItems.value.length - 1].sort = repeaterItems.value.length - 1;
		}

		if (props.parentComponentUpdateData) {
			setValue();
		}
	}

	const deleteRepeaterItem = (index) => {
		if (repeaterItems.value.length > 1) {

			repeaterItems.value = repeaterItems.value.filter((item, inx) => {
				if (index !== inx) {
					return item;
				}
			});

			setValue();
		}
	}

	const setValue = () => {
		const resultData = [];

		repeaterItems.value.forEach((item) => {
			const preparedObj = {};

			const rawItem = toRaw(item);

			for (const key in rawItem) {
				preparedObj[key] = props.onlyValue ? (rawItem[key]?.value ?? rawItem[key].value) : (rawItem[key]?.value ? rawItem[key].value : rawItem[key]);
			}

			resultData.push(preparedObj);
		});

		emit('update:modelValue', resultData);
	}

	/* Наблюдатель за ручным добавлением и измением репитора, TODO: но удалением элемента репитора не перехватывается */
	watch(() => repeaterItems.value, () => {
		if (!props.parentComponentUpdateData) {
			setValue();
		}
	}, { deep: true, immediate: true });

	return {
		repeaterItems,
		fillAdditionalData,
		updateItems,
		addRepeaterItem,
		copyRepeaterItem,
		deleteRepeaterItem,
		setValue,
	};
};
</script>

<template>
	<slot :repeaterItems="repeaterItems" />
</template>
