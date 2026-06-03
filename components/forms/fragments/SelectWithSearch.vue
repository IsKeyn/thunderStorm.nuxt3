<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: null,
	options: {
		type: Array,
		default: [],
	},
	valueKey: {
		type: String,
		default: 'value',
	},
	multiSelect: {
		type: Boolean,
		default: false,
	},
	emptyFieldName: {
		type: String,
		default: 'Выберите опцию',
	},
	classes: {
		type: String,
		default: 'max-w-[30rem]',
	}
});

const selectValue = ref(props.modelValue ?? props.multiSelect ? [] : null);

const searchQuery = ref('');
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const filteredOptions = computed(() => {
	if (!searchQuery.value) return props.options;

	return props.options.filter((option) =>
			option.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

const selectOption = (option) => {
	if (props.multiSelect) {
		if (!selectValue.value.includes(option[props.valueKey])) {
			selectValue.value.push(option[props.valueKey]);
		} else {
			selectValue.value = selectValue.value.filter(item => item !== option[props.valueKey]);
		}
	} else {
		selectValue.value = option[props.valueKey];
	}

	isDropdownOpen.value = false;
};

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
	if (isDropdownOpen.value) {
		searchQuery.value = '';
	}
};

// Обработка клавиатуры
const handleKeydown = (event) => {
	if (event.key === 'Escape') {
		isDropdownOpen.value = false;
	}
};

const getSelectedOptionName = computed(() => {
	if (!selectValue.value) return 'Не выбрано';
	const selected = props.options.filter((option) => {
		return checkSelected(option);
	});

	if (props.multiSelect) {
		return selected;
	} else {
		return selected && selected[0] ? selected[0].name : 'Не выбрано';
	}
});

const checkSelected = (option) => {
	if (!selectValue.value) return false;

	if (props.multiSelect) {
		return selectValue.value.includes(option[props.valueKey]);
	} else {
		return option[props.valueKey] === selectValue.value;
	}
}

watch(() => props.modelValue, (newValue) => {
	selectValue.value = newValue;
}, { immediate: true });

watch(() => selectValue.value, (newValue) => {
	emit("update:modelValue", newValue);
}, { deep: true });

/* НАЧАЛО: Закрытие по клику вне компонента */
const handleClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isDropdownOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
/* КОНЕЦ: Закрытие по клику вне компонента */
</script>

<template>
	<div
			ref="dropdownRef"
			:class="['custom-select', classes]"
	>
		<div
				:class="[
					'select-trigger',
					{ 'open': isDropdownOpen },
					multiSelect ? 'multiSelect' : 'singleSelect'
				]"
				@click="toggleDropdown"
				@keydown="handleKeydown"
				tabindex="0"
		>
			<span class="selected-value">
				<template v-if="multiSelect">
					<span v-if="getSelectedOptionName.length === 0">{{ emptyFieldName }}</span>
					<span
							v-for="(option, key) in getSelectedOptionName"
							:key="key"
							class="multiselect-option-selected"
							@click.prevent="selectOption(option)"
					>
						{{ option.name }} <font-awesome-icon :icon="['fas', 'xmark']" />
					</span>
				</template>
				<template v-else>
					{{ getSelectedOptionName }}
				</template>
			</span>
			<font-awesome-icon v-if="isDropdownOpen" :icon="['fas', 'angle-up']" class="select-arrow" />
			<font-awesome-icon v-else :icon="['fas', 'angle-down']" class="select-arrow" />
		</div>

		<div
				v-if="isDropdownOpen"
				class="select-dropdown"
		>
			<div class="search-container">
				<input
						v-model="searchQuery"
						placeholder="Начните вводить..."
						class="search-input"
						@keydown.enter="filteredOptions[0] && selectOption(filteredOptions[0])"
						ref="searchInputRef"
				/>
			</div>

			<div class="options-container">
				<div
						v-for="option in filteredOptions"
						:key="option.id"
						class="select-option"
						:class="{ 'selected': checkSelected(option) }"
						@click="selectOption(option)"
				>
					{{ option.name }}
				</div>

				<div v-if="filteredOptions.length === 0" class="no-results">
					Ничего не найдено
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.custom-select {
	@apply relative w-full;

	.select-trigger {
		@apply flex items-center justify-between p-2 border border-[var(--second-border-color)] cursor-pointer transition-colors hover:border-[var(--third-hover-color)];

		.selected-value {
			@apply flex-1 overflow-hidden;

			.multiselect-option-selected {
				@apply
					inline-block m-1 pr-2 pl-2 pt-1 pb-2
					bg-[var(--second-active-color)]
					rounded-full;
			}
		}

		&.singleSelect {
			.selected-value {
				@apply text-ellipsis whitespace-nowrap;
			}
		}

		&.multiSelect {
			@apply min-h-[4.5rem];
		}

		&.open {
			@apply border-blue-500;
		}

		.select-arrow {
			@apply ml-2 text-xs transition-transform;
		}
	}

	.select-dropdown {
		@apply absolute top-full left-0 right-0 bg-[var(--main-block-color)] border border-[var(--second-border-color)] mt-1 shadow-lg z-50 max-h-[300px] overflow-hidden flex flex-col;

		.search-container {
			@apply p-2 border-b border-[var(--second-border-color)];

			.search-input {
				@apply w-full p-2 border border-[var(--second-border-color)] outline-none;
			}
		}

		.options-container {
			@apply overflow-y-auto max-h-[250px];

			.select-option {
				@apply p-2 cursor-pointer transition-colors;

				&:hover {
					@apply bg-[var(--second-active-color)];
				}

				&.selected {
					@apply bg-[var(--second-active-color)];
				}
			}

			.no-results {
				@apply p-3 text-center italic;
			}
		}
	}
}
</style>
