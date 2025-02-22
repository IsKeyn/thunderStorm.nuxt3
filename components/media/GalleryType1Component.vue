<script setup>
import EntityFilter from '@/components/filters/EntityFilter.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import LightBox from '@/components/media/LightBox.vue';

import { VueFlexWaterfall } from 'vue-flex-waterfall';

import {
	watch,
	onMounted,
	onUnmounted,
	ref,
} from 'vue'

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	getCsrfCookie,
	errorHandler,
} = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const emit = defineEmits(['selectThisElement']);

const props = defineProps({
	/* Скрывать/показывать кнопку выбора картинки, используется для выбора медиа в FormGenerator.vue */
	selectButton: {
		type: Boolean,
		default: false,
	},
	/* Тип выбора: single-select , multi-select */
	selectType: {
		type: String,
		default: 'single-select',
	},
	selected: {
		type: Array,
		default: [],
	},
	/* Скрывать/показывать полосу прокрутки на элементе body при вызове LightBox.vue */
	hideBodyScrollLine: {
		type: Boolean,
		default: true,
	},
	setViewsLog: {
		type: Boolean,
		default: true,
	},
	groupID: {
		type: Number,
		default: null,
	},
	loadOnScroll: {
		type: Boolean,
		default: true,
	},
	galleryType: {
		type: String,
		default: 'waterfall',
	},
	useFilter: {
		type: Boolean,
		default: false,
	},
	perPage: {
		type: Number,
		default: 16,
	},
});

const fetchedData = ref([]);
const meta = ref({});
const tags = ref([]);

const page = ref(1);
const filters = ref({});
const dataCollectType = ref('show_more');

const requestInProgress = ref(false);

const waterFall = ref();

const { refresh } = await useAsyncData(
		async () => {
			let request = props.groupID ? `${apiUrl.value}media-group/get` : `${apiUrl.value}media/get`;

			const body = {
				perPage: props.perPage,
				page: page.value,
				filter: {},
			};

			const rawFilters = toRaw(filters.value);
			rawFilters.group_id = props.groupID;

			for (let key in rawFilters) {
				if (key === 'tags') {
					if (rawFilters[key].length > 0) {
						body.filter[key] = rawFilters[key];
					}
				} else {
					body.filter[key] = rawFilters[key];
				}
			}

			requestInProgress.value = true;

			const sessionCookie = useCookie(sessionCookieName.value);

			try {
				const csrfCookie = await getCsrfCookie();

				await $fetch(
						request,
						{
							method: 'POST',
							credentials: 'include',
							headers: {
								Accept: 'application/json',
								'X-XSRF-TOKEN': csrfCookie.value,
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							body,
							onResponse({response}) {
								if (response.status === 200) {
									if (dataCollectType.value === 'show_more') {
										fetchedData.value = fetchedData.value.concat(response._data.data);
									} else {
										fetchedData.value = response._data.data;
									}

									meta.value = response._data.meta;
									tags.value = response._data.tags;

									// TODO Обновляет waterfall?
									if (waterFall.value) {
										waterFall.value.updateOrder();
									}

									requestInProgress.value = false;
								}
							},
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const onOrderUpdated = () => {
	console.log(onOrderUpdated);
}

onMounted(() => {
	if (props.loadOnScroll) {
		window.addEventListener('scroll', scrollHandler);
	}
});

onUnmounted(() => {
	if (props.loadOnScroll) {
		window.removeEventListener('scroll', scrollHandler);
	}
});

const scrollHandler = (event) => {
	const gallery = document.getElementById('main-gallery');

	if (gallery) {
		let bottomOfBlock = (gallery.offsetHeight + gallery.offsetTop) - (window.pageYOffset + window.innerHeight);

		if (bottomOfBlock <= 100 && !requestInProgress.value) {
			getNextPage();
		}
	}
}

const getNextPage = async () => {
	if (meta.value.current_page < meta.value.last_page) {
		page.value = meta.value.current_page + 1
		dataCollectType.value = 'show_more';
		refresh();
	}
}

const currentElement = ref(null);
const currentElementKey = ref(null);

const setCurrentElement = (key) => {
	if (Number.isInteger(key)) {
		currentElement.value = fetchedData.value[key];
		currentElementKey.value = key;

		if (fetchedData.value.length <= currentElementKey.value + 2) {
			getNextPage();
		}
	} else {
		hideLightBox();
	}
}

const setNewFilters = (newFilters) => {
	filters.value = newFilters.value;
	page.value = 1;
	dataCollectType.value = 'update';
	refresh();
}

const updateLikes = (params) => {
	const { entityId, count } = params;

	for (const key in fetchedData.value) {
		if (fetchedData.value[key].id === entityId) {
			fetchedData.value[key].likes = count;
			break;
		}
	}
}

const selectedIds = ref([]);

const createSelectedIdsArray = () => {
	selectedIds.value = [];

	if (props.selected) {
		for (let key in props.selected) {
			if (props.selected[key]?.id) {
				selectedIds.value.push(props.selected[key].id);
			}
		}
	}
}

createSelectedIdsArray();

watch(() => props.selected, () => {
	createSelectedIdsArray();
}, { deep: true });

const hasSelecter = (item) => {
	if (item?.id) {
		return selectedIds.value.includes(item.id);
	}

	return false;
}

const getSelectedKey = (item) => {
	if (item?.id) {
		return selectedIds.value.indexOf(item.id);
	}

	return false;
}

const selectFormLightBox = (event) => {
	if (hasSelecter(event)) {
		emit('unselectThisElement', getSelectedKey(event))
	} else {
		emit('selectThisElement', event);
		hideLightBox();
	}
}

const hideLightBox = () => {
	currentElement.value = null;
	currentElementKey.value = null;
}
</script>

<template>
		<EntityFilter
				v-if="useFilter"
				:excludedTags="tags"
				@setNewFilters="setNewFilters"
		/>
		<template v-if="fetchedData.length > 0">
			<VueFlexWaterfall
					v-if="galleryType === 'waterfall'"
					id="main-gallery"
					align-content="center"
					col="4"
					col-spacing="15"
					:break-at="{ 900: 3, 600: 2, 300: 1 }"
					break-by-container: true
					ref="waterFall"
					@order-updated="onOrderUpdated"
			>
				<div
						v-for="(element, key) in fetchedData"
						:key="key"
						class="element"
				>
						<span
								v-if="selectButton"
								class="btn-icon select-button"
								@click="$emit('selectThisElement', element)"
						>
							<font-awesome-icon :icon="['fas', 'check']"/>
						</span>
					<img
							@click="setCurrentElement(key)"
							class="img"
							:src="element.src"
							:alt="element.name"
					/>
				</div>
			</VueFlexWaterfall>
			<div
					v-if="galleryType === 'simple'"
					class="simple"
			>
				<div
						v-for="(element, key) in fetchedData"
						:key="key"
						class="element"
				>
						<span
								v-if="selectButton"
								:class="['btn-icon select-button', hasSelecter(element) ? 'selected' : '']"
								@click="hasSelecter(element) ? $emit('unselectThisElement', getSelectedKey(element)) : $emit('selectThisElement', element)"
						>
							<font-awesome-icon :icon="['fas', 'check']"/>
						</span>
					<img
							@click="setCurrentElement(key)"
							class="img"
							:src="element.src"
							:alt="element.name"
					/>
				</div>
			</div>
		</template>
		<LightBox
			v-if="currentElement"
			:image="currentElement"
			:prevElementKey="currentElementKey - 1 >= 0 ? currentElementKey - 1 : null"
			:nextElementKey="currentElementKey + 2 <= fetchedData.length ? currentElementKey + 1 : null"
			:setViewsLog="setViewsLog"
			:selectButton="selectButton"
			:selected="hasSelecter(currentElement)"
			:hideBodyScrollLine="hideBodyScrollLine"
			@setCurrentElement="setCurrentElement"
			@selectThisElement="selectFormLightBox($event)"
			@updateLikes="updateLikes"
		/>

		<div
				v-if="meta?.current_page < meta?.last_page"
				class="text-center"
		>
			<ActionButton
					buttonName="Показать ещё"
					:actionInProgress="requestInProgress"
					@startAction="getNextPage"
			/>
		</div>
</template>

<style lang="scss" scoped>
.element {
	@apply relative w-[308px] mb-2 cursor-pointer;

	.btn-icon {
		@apply
			absolute z-[700]
			text-[25px] text-center leading-[45px]
			cursor-pointer
			bg-[var(--second-bg-color)]
			w-[45px] h-[45px]
			rounded-full
		;

		&.selected {
			@apply bg-[var(--second-active-color)];
		}

		&.select-button {
			@apply
				top-[5px] right-[5px]
			;
		}

		&:hover {
			@apply bg-[var(--second-hover-color)];
		}
	}
}

.simple {
	@apply grid grid-cols-12;

	.element {
		@apply col-span-4;
	}
}
</style>
