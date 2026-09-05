<script setup>
import UserNotificationCard from '@/components/user/notifications/UserNotificationCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';

const emit = defineEmits(['loadingToggle', 'toggleModal']);

import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const runtimeConfig = useRuntimeConfig();

const { subscribe, unsubscribe } = useWebSocket();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

const props = defineProps({
	perPage: {
		type: Number,
		default: 10,
	},
	contentBlockClass: {
		type: String,
		default: 'notification-list-content',
	}
});

import { pagination } from '@/composables/ui/pagination.js'
const {
	page,
	perPage,
	scrollAfterLoad,
	setRefresh,
	changePage,
	setPerPage
} = pagination(props.perPage);

const requestName = 'user_notification_list';
const hiddenRefresh = ref(false);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				page: page.value,
				perPage: perPage.value,
			};

			const response = await Promise.resolve(
					sendApiRequest('auth/notification/get', 'GET', query, requestName, '')
			);

			emit('loadingToggle');

			if (hiddenRefresh.value) hiddenRefresh.value = false;

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const notifications = ref([]);

watch(() => requestData.value?.data, (newData) => {
	if (newData) {
		notifications.value = newData
	}
}, { immediate: true })

const fetchedData = computed(() => notifications.value);
const paginationData = computed(() => requestData.value?.meta || null);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);

const updateData = () => {
	hiddenRefresh.value = true;
	refresh();
}

const setAllLikeViewed = async () => {
	requestInProgress.value = true;
	await sendApiRequest('auth/notification/set-viewed-all', 'POST', {}, 'setAllNotificationLikeViewed');
	updateData();
}

onMounted(async () => {
	if (runtimeConfig.public.hasWebSockedServer) {
		const userId = userStore.user?.id;
		const MAX_ITEMS = perPage.value;

		const { unsubscribe: stop, subscriptionId } = subscribe(
				`App.Models.User.${userId}`,
				'NotificationCreated',
				(e) =>
				{
					const newNotification = e?.notification || e?.data || e;

					if (newNotification?.id) {
						// Проверка на дубликаты
						const exists = notifications.value.some(n => n.id === newNotification.id);

						if (!exists) {
							// Создаём новый массив: новый элемент + старые
							const updatedList = [newNotification, ...notifications.value];

							// Если превысили лимит — обрезаем последний элемент
							if (updatedList.length > MAX_ITEMS) {
								updatedList.pop(); // удаляем последний элемент (самый старый на странице)
							}

							notifications.value = updatedList;

							// Опционально: обновить пагинацию, если нужно
							// Обновляем total только если мы на первой странице
							if (paginationData.value && page.value === 1) {
								paginationData.value.total = (paginationData.value.total || 0) + 1;
							}
						}
			}
		});
	}
});

watch(
		() => [fetchedData.value, requestInProgress.value],
		async ([newData, isPending]) => {
			// Ждем, пока данные загрузятся И прелоадер исчезнет
			if (scrollAfterLoad.value && newData && newData.length && !isPending) {
				await nextTick();

				setTimeout(() => {
					scrollToElement(`.${props.contentBlockClass}`);
					scrollAfterLoad.value = false;
				}, 50);
			}
		},
		{ deep: true }
);
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData?.length">
		<button
				class="btn btn-simple"
				@click="setAllLikeViewed"
		>Отметить все как прочитанные <font-awesome-icon  class="ml-2" icon="fa-solid fa-check-double" /></button>
		<div :class="[contentBlockClass]">
			<UserNotificationCard
					v-for="(item, key) in fetchedData"
					:key="key"
					:notification="item"
					@updateData="updateData"
					@toggleModal="emit('toggleModal')"
			/>
		</div>
		<Pagination
				v-if="paginationData"
				:pagination="paginationData"
				:navigationButtons="true"
				:perPageOptionsProp="[10, 20, 30]"
				:setQueryParams="false"
				@changePage="changePage"
				@setPerPage="setPerPage"
		/>
	</div>
	<div v-else class="item-box">
		Оповещений нет
	</div>
</template>
