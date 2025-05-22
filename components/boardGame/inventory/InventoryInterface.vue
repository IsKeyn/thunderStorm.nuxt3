<script setup>
/*
* TODO List
* Сохранять сортировку предметов в инвенторе
*/

import Draggable from 'vuedraggable'

import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LightBox from '@/components/media/LightBox.vue'
import GamblingGame from '@/components/boardGame/inventory/GamblingGame.vue'
import Modal from '@/components/modals/Modal.vue';
import UseItem from '@/components/boardGame/inventory/UseItem';
import ItemsList from '@/components/boardGame/inventory/ItemsList.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';

import { ref, watch } from 'vue'

const emit = defineEmits(['fetchLogs', 'updateUserItems', 'updateBoardGameInfo']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();

import { notifications } from '@/composables/notifications.js';
const {
	alert,
	error,
	choiceAlert
} = notifications();

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
	ItemList: {
		type: Array,
		default: [],
	},
	UserItems: {
		type: Array,
		default: [],
	},
	UsedItems: {
		type: Array,
		default: [],
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const ItemList = ref([]);
const UserItems = ref([]);
const UsedItems = ref([]);

ItemList.value = props.ItemList;
UserItems.value = props.UserItems;
UsedItems.value = props.UsedItems;

// watch(() => props.ItemList, () => {
// 	ItemList.value = props.ItemList;
// }, { deep: true });

watch(() => props.UserItems, () => {
	UserItems.value = props.UserItems;
}, { deep: true });

watch(() => props.UsedItems, () => {
	UsedItems.value = props.UsedItems;
}, { deep: true });

/* Получение данных */
const requestInProgress = ref(false);

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

const addItemDragAndDropEvent = (event) => {
	const original = event.item.__draggable_context.element

	addItem(original.id, original.name);
}

const addItem = (id, name) => {
	if (userStore.user && Object.keys(userStore.user).length > 0) {
		const response = addItemToInventory(id, name);

		if (!response) {
			error('Ошибка добавления предмета в инвентарь');
			return false;
		} else {
			response.then((element) => {
				setInventoryId(lastElementId.value, element);
				emit('updateUserItems', UserItems.value);
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

const modalOpen = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
};

const itemForUse = ref();

const useItem = (item) => {
	openCloseModalFunc();

	itemForUse.value = item;
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

const useItemFromEmit = (params) => {
	openCloseModalFunc();
	useItemRequest(params.item.inventory_id, params.item.name, params.additionalParams);
}

const useItemRequest = async (inventory_id, name, additionalParams = {}) => {
	requestInProgress.value = true;

	try {
		const body = {
			id: inventory_id,
			board_game_id: props.boardGameId,
			additionalParams,
		}

		const response = await sendApiRequest('board-game/inventory/use', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				alert(`Предмет "${name}" был использован`);

				const logBody = {
					board_game_id: props.boardGameId,
					message: additionalParams.logMessage ? additionalParams.logMessage : `использовал предмет "${name}"`
				};
				setLog(logBody);

				emit('fetchLogs');
				emit('updateInventory');

				// TODO заменить на for, чтобы выходить из цикла при нахождении элемента
				UserItems.value.forEach((item) => {
					if (item.inventory_id === inventory_id) {
						UsedItems.value.unshift(item);
					}
				});

				UserItems.value = UserItems.value.filter(item => item.inventory_id !== inventory_id);
				emit('updateUserItems', UserItems.value);
				emit('updateBoardGameInfo');
			}
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
			emit('updateUserItems', UserItems.value);
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
};

const addItemToInventoryEmit = (data) => {
	let id = Date.now() + Math.random();

	lastElementId.value = id;

	ItemList.value.forEach((item) => {
		if (item.id === data.id) {
			item.inventory_id = id;
			item.id = id;
			UserItems.value.unshift(item);
		}
	});

	addItem(data.id, data.name);
}
</script>

<template>
	<h2 class="inv-title">Рулетка предметов</h2>
	<GamblingGame
			v-if="ItemList.length > 0"
			:items="ItemList"
			:boardGameId="boardGameId"
			@setOpenedImage="setOpenedImage"
			@addItemToInventory="addItemToInventoryEmit"
	/>
	<div v-if="ItemList.length > 0" class="inventory">
		<div class="user-items">
			<h2 class="inv-title">Ваш инвентарь</h2>
			<Draggable
					v-model="UserItems"
					:group="{ name: 'shared', pull: false, put: true }"
					item-key="id"
					@add="addItemDragAndDropEvent"
					class="wrapper"
			>
				<span v-if="UserItems.length === 0">Предметов нет</span>
				<template #item="{ element }">
					<ItemCard
							:element="element"
							:showControlPanel="true"
							:useLightBox="true"
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
					class="wrapper"
			>
				<span v-if="ItemList.length === 0">Предметов нет</span>
				<template #item="{ element }">
					<ItemCard
							:element="element"
							:useLightBox="true"
							@setOpenedImage="setOpenedImage"
					/>
				</template>
			</Draggable>
		</div>
	</div>

<!--	<OpeningBox-->
<!--			v-if="ItemList.length > 0"-->
<!--			title="Все предметы"-->
<!--			classes="pb-[1rem] pl-[1rem] pr-[1rem]"-->
<!--	>-->
<!--		<ItemsList-->
<!--				:itemList="ItemList"-->
<!--				@setOpenedImage="setOpenedImage"-->
<!--		/>-->
<!--	</OpeningBox>-->

	<OpeningBox
			v-if="ItemList.length > 0"
			title="Использованные предметы"
			classes="pb-[1rem] pl-[1rem] pr-[1rem]"
	>
		<div class="wrapper">
			<span v-if="UsedItems.length === 0">Предметов нет</span>
			<ItemCard
					v-for="(element, key) in UsedItems"
					:key="key"
					:element="element"
					:useLightBox="true"
					@setOpenedImage="setOpenedImage"
			/>
		</div>
	</OpeningBox>

	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Применение предмета</h3>
			<div class="link-parent-box">
				<UseItem
					:item="itemForUse"
					:boardGameInfo="boardGameInfo"
					@openCloseModalFunc="openCloseModalFunc"
					@useItemFromEmit="useItemFromEmit"
				/>
			</div>
		</div>
	</Modal>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.inv-title {
	@apply font-bold mb-4 uppercase;
}

.inventory {
	@apply flex gap-4 cursor-pointer;

	.user-items,
	.chest-with-items {
		@apply w-1/2 p-4;

		.wrapper {
			@apply h-[600px] overflow-auto;
		}
	}

	.used-items {
		@apply w-full p-4;

		.wrapper {
			@apply max-h-[600px] overflow-auto;
		}
	}
}
</style>
