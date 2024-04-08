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

const data = ref([]);
const meta = ref({});
const perPage = ref(12);
const page = ref(1);
const filters = ref({});
const dataCollectType = ref('show_more');

const requestInProgress = ref(false);

const waterFall = ref();

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}media/get`;

			const body = {
				perPage: perPage.value,
				page: page.value,
				filter: {},
			};

			const rawFilters = toRaw(filters.value);

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
										data.value = data.value.concat(response._data.data);
									} else {
										data.value = response._data.data;
									}

									meta.value = response._data.meta;

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
	window.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
	window.removeEventListener('scroll', scrollHandler);
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
		currentElement.value = data.value[key];
		currentElementKey.value = key;

		if (data.value.length <= currentElementKey.value + 2) {
			getNextPage();
		}
	} else {
		currentElement.value = null;
		currentElementKey.value = null;
	}
}

const setNewFilters = (newFilters) => {
	filters.value = newFilters.value;
	page.value = 1;
	dataCollectType.value = 'update';
	refresh();
}
</script>

<template>
		<EntityFilter
			@setNewFilters="setNewFilters"
		/>
		<VueFlexWaterfall
				v-if="data.length > 0"
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
						v-for="(element, key) in data"
						:key="key"
						class="element"
						@click="setCurrentElement(key)"
				>
					<img
							class="img"
							:src="element.src"
							:alt="element.name"
					/>
				</div>
		</VueFlexWaterfall>
		<LightBox
			v-if="currentElement"
			:image="currentElement"
			:prevElementKey="currentElementKey - 1 >= 0 ? currentElementKey - 1 : null"
			:nextElementKey="currentElementKey + 2 <= data.length ? currentElementKey + 1 : null"
			:setViewsLog="true"
			@setCurrentElement="setCurrentElement"
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
	@apply w-[308px] mb-2 cursor-pointer;
}
</style>
