<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: null,
	options: {
		type: Array,
		default: [],
	},
});

const selectValue = ref(props.modelValue ?? null);
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
	selectValue.value = option.value;
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
	const selected = props.options.filter(opt => opt.value === selectValue.value);

	return selected && selected[0] ? selected[0].name : 'Не выбрано';
});

watch(() => props.modelValue, (newValue) => {
	selectValue.value = newValue;
});

watch(() => selectValue.value, (newValue) => {
	emit("update:modelValue", newValue);
});

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
			class="custom-select"
	>
		<div
				class="select-trigger"
				:class="{ 'open': isDropdownOpen }"
				@click="toggleDropdown"
				@keydown="handleKeydown"
				tabindex="0"
		>
			<span class="selected-value">{{ getSelectedOptionName }}</span>
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
						:class="{ 'selected': selectValue === option.id }"
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
	@apply relative w-full max-w-[30rem];

	.select-trigger {
		@apply flex items-center justify-between p-2 border border-[var(--second-border-color)] cursor-pointer transition-colors hover:border-[var(--third-hover-color)];

		&.open {
			@apply border-blue-500;
		}

		.selected-value {
			@apply flex-1 overflow-hidden text-ellipsis whitespace-nowrap;
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
			}

			.no-results {
				@apply p-3 text-center italic;
			}
		}
	}
}
</style>
