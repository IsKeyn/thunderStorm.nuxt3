<script setup>
/*
* TODO List
* Сохранять сортировку предметов в инвенторе
*/

import Draggable from 'vuedraggable'

import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LightBox from '@/components/media/LightBox.vue'

import { ref } from 'vue'

const emit = defineEmits(['fetchLogs']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();

import { notifications } from '@/composables/notifications.js';
const { alert, error, choiceAlert } = notifications();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const {
	setLog,
} = boardGameLog();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const ItemList = ref([]);
const UserItems = ref([]);
const UsedItems = ref([]);

/* Получение данных */
const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/getItemAndInventory`;

			const query = {
				board_game_id: props.boardGameId,
			};
			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									ItemList.value = response._data.items;

									if (response._data.inventory) {
										response._data.inventory.forEach((item) => {
											if (item.has_used === 1) {
												UsedItems.value.push({ ...item.item, inventory_id: item.id });
											} else {
												UserItems.value.push({ ...item.item, inventory_id: item.id });
											}
										})
									}
								} else {
									error('Request error', 5000);
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const addItemToInventory = async (itemId, name) => {
	requestInProgress.value = true;

	try {
		const body = {
			board_game_id: props.boardGameId,
			board_game_item_id: itemId,
		}

		const response = await sendApiRequest('board-game/inventory/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			alert(`Предмет "${name}" добавлен в Ваш инвентарь`);

			const logBody = {
				board_game_id: props.boardGameId,
				message: `добавил предмет "${name}" в инвентарь`
			};
			setLog(logBody);

			emit('fetchLogs');

			return response.id;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

/* Фунция копирование элемента при перетаскивании */
const lastElementId = ref(null);

const cloneItem = (original) => {
	let id = Date.now() + Math.random();

	lastElementId.value = id;

	return { ...original, id }
}

const addItem = (event) => {
	const original = event.item.__draggable_context.element

	if (userStore.user && Object.keys(userStore.user).length > 0) {
		const response = addItemToInventory(original.id, original.name);

		if (!response) {
			error('Ошибка добавления предмета в инвентарь');
			return false;
		} else {
			response.then((element) => {
				setInventoryId(lastElementId.value, element);
			});
		}
	} else {
		error('Авторизуйтесь, чтобы инвентарь сохранил свое состояние');
	}
}

const setInventoryId = (oldId, newId) => {
	// TODO заменить на for, чтобы выходить из цикла при нахождении элемента
	UserItems.value.forEach((item, key) => {
		if (item.id === oldId) {
			UserItems.value[key].inventory_id = newId;
		}
	});
}

const useItem = (item) => {
	choiceAlert(
			{
				title: 'Использовать предмет',
				message: `Использовать предмет "${item.name}"?`,
				buttons: [
					{
						name: 'Да',
						func: () => {
							useItemRequest(item.inventory_id, item.name);
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
}

const deleteItem = (item) => {
	choiceAlert(
			{
				title: 'Удалить предмет',
				message: `Удалить элемент "${item.name}"?`,
				buttons: [
					{
						name: 'Да',
						func: () => {
							deleteItemRequest(item.inventory_id, item.name);
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
}

const useItemRequest = async (inventory_id, name) => {
	requestInProgress.value = true;

	try {
		const body = {
			id: inventory_id,
			board_game_id: props.boardGameId,
		}

		const response = await sendApiRequest('board-game/inventory/use', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			alert(`Предмет "${name}" был использован`);

			const logBody = {
				board_game_id: props.boardGameId,
				message: `использовал предмет "${name}"`
			};
			setLog(logBody);

			emit('fetchLogs');

			// TODO заменить на for, чтобы выходить из цикла при нахождении элемента
			UserItems.value.forEach((item) => {
				if (item.inventory_id === inventory_id) {
					UsedItems.value.unshift(item);
				}
			});

			UserItems.value = UserItems.value.filter(item => item.inventory_id !== inventory_id);
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
};

const deleteItemRequest = async (inventory_id, name) => {
	requestInProgress.value = true;

	try {
		const body = {
			id: inventory_id,
			board_game_id: props.boardGameId,
		}

		const response = await sendApiRequest('board-game/inventory/destroy', 'DELETE', body);

		if (response) {
			requestInProgress.value = false;

			alert(`Предмет "${name}" был удален`);

			const logBody = {
				board_game_id: props.boardGameId,
				message: `удалил предмет "${name}"`
			};
			setLog(logBody);

			emit('fetchLogs');

			UserItems.value = UserItems.value.filter(item => item.inventory_id !== inventory_id);
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
};
</script>

<template>
	<div v-if="ItemList.length > 0" class="inventory">
		<div class="user-items">
			<h2 class="inv-title">Ваш инвентарь</h2>
			<Draggable
					v-model="UserItems"
					:group="{ name: 'shared', pull: false, put: true }"
					item-key="id"
					@add="addItem"
					class="h-full"
			>
				<span v-if="UserItems.length === 0">Предметов нет</span>
				<template #item="{ element }">
					<ItemCard
							:element="element"
							:showControlPanel="true"
							@setOpenedImage="setOpenedImage"
							@deleteItem="deleteItem"
							@useItem="useItem"
					/>
				</template>
			</Draggable>
		</div>

		<div class="chest-with-items">
			<h2 class="inv-title">Сундук артефактов</h2>
			<Draggable
					:list="ItemList"
					:group="{ name: 'shared', pull: 'clone', put: false }"
					:clone="cloneItem"
					item-key="id"
					class="h-full"
			>
				<span v-if="ItemList.length === 0">Предметов нет</span>
				<template #item="{ element }">
					<ItemCard
							:element="element"
							@setOpenedImage="setOpenedImage"
					/>
				</template>
			</Draggable>
		</div>
	</div>

	<div class="inventory">
		<div class="used-items">
			<h2 class="inv-title">Использованные предметы</h2>
				<span v-if="UsedItems.length === 0">Предметов нет</span>
					<ItemCard
							v-for="(element, key) in UsedItems"
							:key="key"
							:element="element"
							@setOpenedImage="setOpenedImage"
					/>
		</div>
	</div>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.inventory {
	@apply flex gap-4 cursor-pointer;

	.inv-title {
		@apply font-bold mb-4 uppercase;
	}

	.user-items,
	.chest-with-items {
		@apply w-1/2 p-4;
	}

	.used-items {
		@apply w-full p-4;
	}
}
</style>
