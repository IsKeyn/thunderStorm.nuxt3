<script setup>
const props = defineProps({
	name: {
		type: String,
		default: 'tab',
	},
	tabs: {
		type: Array,
		default: [
			{
				id: 1,
				title: 'Таб 1',
				icon: null,
			},
			{
				id: 2,
				title: 'Таб 2',
				icon: null,
			},
			{
				id: 3,
				title: 'Таб 3',
				icon: null,
			},
		],
	},
	defaultCurrentTab: {
		default: 1,
	},
	showTabs: {
		type: Boolean,
		default: true,
	},
	useQueryParam: {
		type: Boolean,
		default: true,
	},
	useHardDisableTab: {
		type: Boolean,
		default: true,
	},
});

const currentTab = ref(props.defaultCurrentTab);
const containerRef = ref(null);
const tabsContainerRef = ref(null);
const dropdownRef = ref(null);
const visibleTabs = ref([]);
const hiddenTabs = ref([]);
const isDropdownOpen = ref(false);

// Ресайз обсервер для отслеживания изменений размера контейнера
const resizeObserver = ref(null);

watch(() => props.defaultCurrentTab, () => {
	currentTab.value = props.defaultCurrentTab;
});

const router = useRouter();
const route = useRoute();

if (props.useQueryParam && route.query[props.name]) {
	for (let key in props.tabs) {
		if (String(props.tabs[key].id) === route.query[props.name]) {
			currentTab.value = props.tabs[key].id;
			break;
		}
	}
}

const setTab = (tabID) => {
	currentTab.value = tabID;
	isDropdownOpen.value = false;

	if (props.useQueryParam) {
		router.push({
			name: route.name,
			query: {
				...route.query,
				[props.name]: tabID,
			},
		});
	}
}

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
}

const closeDropdown = () => {
	isDropdownOpen.value = false;
}

// Функция для расчета видимых и скрытых табов
const calculateVisibleTabs = () => {
	if (!containerRef.value || !tabsContainerRef.value) return;

	const containerWidth = containerRef.value.offsetWidth;
	const tabs = props.tabs;
	const tempVisibleTabs = [];
	const tempHiddenTabs = [];

	let totalWidth = 0;
	const dropdownButtonWidth = 80; // Примерная ширина кнопки с многоточием
	const margin = 24; // mr-6 = 1.5rem = 24px

	// Создаем временный элемент для измерения ширины табов
	const tempElement = document.createElement('div');
	tempElement.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    padding-bottom: 0.5rem;
  `;
	document.body.appendChild(tempElement);

	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];

		// Измеряем ширину текста таба
		tempElement.textContent = tab.title;
		const tabWidth = tempElement.offsetWidth + margin;

		// Проверяем, вмещается ли таб + кнопка dropdown (если нужно)
		if (totalWidth + tabWidth + (tempHiddenTabs.length > 0 ? dropdownButtonWidth : 0) <= containerWidth) {
			tempVisibleTabs.push(tab);
			totalWidth += tabWidth;
		} else {
			tempHiddenTabs.push(tab);
		}
	}

	// Удаляем временный элемент
	document.body.removeChild(tempElement);

	// Если есть скрытые табы, проверяем можно ли показать еще один таб вместо dropdown
	if (tempHiddenTabs.length > 0 && tempVisibleTabs.length > 0) {
		const lastVisibleTab = tempVisibleTabs[tempVisibleTabs.length - 1];

		// Измеряем ширину последнего видимого таба
		tempElement.textContent = lastVisibleTab.title;
		const lastTabWidth = tempElement.offsetWidth + margin;

		// Если ширина последнего таба больше ширины dropdown кнопки,
		// скрываем его и добавляем в dropdown
		if (lastTabWidth > dropdownButtonWidth) {
			tempVisibleTabs.pop();
			tempHiddenTabs.unshift(lastVisibleTab);
		}
	}

	visibleTabs.value = tempVisibleTabs;
	hiddenTabs.value = tempHiddenTabs;
}

// Инициализация ресайз обсервера
onMounted(() => {
	calculateVisibleTabs();

	resizeObserver.value = new ResizeObserver(() => {
		calculateVisibleTabs();
	});

	if (containerRef.value) {
		resizeObserver.value.observe(containerRef.value);
	}

	// Закрываем dropdown при клике вне его области
	document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
	if (resizeObserver.value) {
		resizeObserver.value.disconnect();
	}
	document.removeEventListener('click', closeDropdown);
});

// Останавливаем всплытие события для предотвращения закрытия dropdown
const stopPropagation = (event) => {
	event.stopPropagation();
}
</script>

<template>
	<div ref="containerRef" class="tabs-container">
		<ul v-if="showTabs" ref="tabsContainerRef" class="tabs-list">
			<!-- Видимые табы -->
			<li
					v-for="tab in visibleTabs"
					:key="tab.id"
					@click="setTab(tab.id)"
					class="tab-item"
			>
				<div :class="['tab-button', currentTab === tab.id ? 'active' : '']">
					<font-awesome-icon v-if="tab.icon" :icon="tab.icon" class="mr-1" /> {{ tab.title }}
				</div>
			</li>

			<!-- Dropdown для скрытых табов -->
			<li
					v-if="hiddenTabs.length > 0"
					class="tab-item dropdown-trigger"
					@click.stop="toggleDropdown"
			>
				<div class="tab-button dropdown-button">
					...
				</div>

				<!-- Выпадающий список -->
				<div
						v-if="isDropdownOpen"
						ref="dropdownRef"
						class="dropdown-menu"
						@click.stop="stopPropagation"
				>
					<div
							v-for="tab in hiddenTabs"
							:key="tab.id"
							@click="setTab(tab.id)"
							class="dropdown-item"
					>
						<div :class="['dropdown-button', currentTab === tab.id ? 'active' : '']">
							{{ tab.title }}
						</div>
					</div>
				</div>
			</li>
		</ul>

		<div
				v-for="(tab, index) in tabs"
				:key="index"
				v-show="tab.id === currentTab"
		>
			<slot
					v-if="useHardDisableTab ? tab.id === currentTab : true"
					:name="`tab-${tab.id}`"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.tabs-container {
	@apply relative w-full;
}

.tabs-list {
	@apply relative flex flex-nowrap mb-4 ml-0 list-none list-inside;

	.tab-item {
		@apply mr-6 last:mr-0 flex-shrink-0;

		.tab-button {
			@apply pb-2 whitespace-nowrap cursor-pointer;

			&:hover {
				@apply text-[var(--main-hover-color)];
			}

			&.active {
				@apply border-b-2 border-[var(--main-hover-color)] text-[var(--main-hover-color)];
			}
		}

		&.dropdown-trigger {
			@apply relative;

			.dropdown-button {
				@apply px-2;
			}

			.dropdown-menu {
				@apply absolute top-full right-0 mt-1 bg-[var(--main-bg-color)] border border-gray-200 shadow-lg z-50 min-w-[120px] max-h-60 overflow-y-auto;

				.dropdown-item {
					@apply px-3 py-2 cursor-pointer hover:bg-gray-50;

					.dropdown-button {
						@apply p-0 border-none;

						&:hover {
							@apply text-[var(--main-hover-color)] bg-transparent;
						}

						&.active {
							@apply text-[var(--main-hover-color)] bg-transparent border-none;
						}
					}
				}
			}
		}
	}
}
</style>
