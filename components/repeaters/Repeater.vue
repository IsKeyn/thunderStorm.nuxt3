<script setup>
import { watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
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
	repeaterItem: {
		type: Object,
		default: {},
	},
});

const {
	repeaterItems,
	updateItems,
	addRepeaterItem,
	deleteRepeaterItem,
} = repeater();

defineExpose({
	addRepeaterItem,
	deleteRepeaterItem,
});

updateItems(props.modelValue);

function repeater() {
	const repeaterItems = ref ([]); // Массив с элементами репитора
	const hasFirstLoad = ref(false);

	const hasFileFromGallery = computed(() => {
		let returnData = false;

		for (let key in props.repeaterItem) {
			if (props.repeaterItem[key] === 'fileFromGallery') {
				returnData = true;
			}
		}

		return returnData;
	});


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

		// TODO не сломает репитер?
		// hasFirstLoad.value = true;
	}

	const fillRepeaterItems = (items) => {
		items.forEach((item) => {
			let preparedData = structuredClone(props.repeaterItem);

			if (Object.keys(props.repeaterItem).length > 0) {
				for (const key in item) {
					if (preparedData[key]) {
						if (preparedData[key].value) {
							preparedData[key].value = item[key];
						} else if (preparedData[key]) {
							preparedData[key] = item[key];
						}

						// Заполнение objectValue необходимо только для типов fileFromGallery
						if (hasFileFromGallery.value) {
							preparedData[key].objectValue = item;
						}
					}
				}
			} else {
				preparedData = item;
			}

			repeaterItems.value.push(preparedData);
		});
	}

	const addRepeaterItem = () => {
		repeaterItems.value.push(structuredClone(props.repeaterItem));

		// setVmodel();
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

	const setVmodel = () => {
		const resultData = [];

		repeaterItems.value.forEach((item) => {
			const preparedObj = {};

			const rawItem = toRaw(item);

			for (const key in rawItem) {
				preparedObj[key] = rawItem[key];
			}

			resultData.push(preparedObj);
		});

		emit('update:modelValue', resultData);
	}

	// Наблюдатель за ручным добавлением и измением репитора, но удалением элемента репитора не перехватывается
	watch(() => repeaterItems.value, () => {
		// if (hasFirstLoad.value) {
			setVmodel();
		// }
	}, { deep: true });

	// Наблюдатель должен сработать один раз, при первом появлении данных v-model
	watch(() => props.modelValue, (newValue) => {
		if (!hasFirstLoad.value) {
			updateItems(toRaw(newValue));
			hasFirstLoad.value = true;
		}
	}, { deep: true });

	// Наблюдатель должен сработать, при появлении данных заполнения списков (select)
	watch(() => props.additionalData, (newValue) => {
		if (newValue && props.params?.additionalDataKeys) {
			props.params.additionalDataKeys.forEach((additionalKeys) => {
				if (newValue[additionalKeys]) {
					toRaw(newValue[additionalKeys]).forEach((item) => {
						props.repeaterItem[additionalKeys].options.push({
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

	return {
		repeaterItems,
		updateItems,
		addRepeaterItem,
		deleteRepeaterItem,
	};
}
</script>

<template>
	<slot
			:repeaterItems="repeaterItems"
	/>
</template>
