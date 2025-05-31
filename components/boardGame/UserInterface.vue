<script setup>
import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';
import VerifyEmailBlock from "@/components/user/VerifyEmailBlock.vue";
import UserInfo from '@/components/boardGame/user/UserInfo.vue';
import GoInThisGame from '@/components/boardGame/user/GoInThisGame.vue';
import Inventory from '@/components/boardGame/inventory/Inventory.vue';
import Dices from '@/components/boardGame/Dices.vue';
import Points from '@/components/boardGame/user/Points.vue';
import UserGame from '@/components/boardGame/user/UserGame.vue';
import StatusEffects from '@/components/boardGame/user/StatusEffects.vue';
import Timer from '@/components/boardGame/timer/Timer.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { roles } from '@/composables/roles.js';
import { ref } from "vue";
const { hasRole } = roles();

const emit = defineEmits(['fetchLogs', 'updateBoardGameInfo', 'showPlayer']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const reCalc = ref(false);
const activeAuthModal = ref(false);

const openCloseBoxFunc = () => {
	activeAuthModal.value = !activeAuthModal.value;
};

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

const alreadyInGame = computed(() => {
	const player = props.boardGameInfo.players.filter((item) => {
		if (item.user.id === userStore.user.id) {
			return true;
		} else {
			return false;
		}
	});

	return player.length > 0;
});

const gameComponent = ref(null);
const inventoryComponent = ref(null);

const showGame = () => {
	gameComponent.value.openCloseModalFunc();
}

const showInventory = () => {
	inventoryComponent.value.openCloseModalFunc();
}
</script>

<template>
	<div v-if="userStore.user && Object.keys(userStore.user).length > 0">
		<template v-if="userStore.user.email_verified_at">
			<UserInfo
					@updateBoardGameInfo="emit('updateBoardGameInfo')"
					@showPlayer="$emit('showPlayer', $event)"
					@showGame="showGame()"
					@showInventory="showInventory()"
			/>
			<GoInThisGame
					v-if="!alreadyInGame"
					:boardGameId="boardGameId"
					:boardGameInfo="boardGameInfo"
					@updateBoardGameInfo="emit('updateBoardGameInfo')"
			/>
			<template v-else>
				<StatusEffects
						:boardGameId="boardGameId"
						:boardGameInfo="boardGameInfo"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
				/>
				<Dices
						:boardGameId="boardGameId"
						:size="75"
						@fetchLogs="emit('fetchLogs')"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
				/>
<!--				<Timer-->
<!--						:boardGameId="boardGameId"-->
<!--				/>-->
				<Points
						:boardGameId="boardGameId"
						:boardGameInfo="boardGameInfo"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
						@fetchLogs="emit('fetchLogs')"
				/>
				<UserGame
						ref="gameComponent"
						:boardGameId="boardGameId"
						:boardGameInfo="boardGameInfo"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
						@showPlayer="$emit('showPlayer', $event)"
						@updateInventory="updateInventory"
				/>
				<span class="user-interface-title">Инвентарь</span>
				<Inventory
						ref="inventoryComponent"
						:boardGameId="boardGameId"
						:boardGameInfo="boardGameInfo"
						@fetchLogs="emit('fetchLogs')"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
				/>
			</template>
		</template>
		<template v-else>
			<VerifyEmailBlock />
		</template>
	</div>
	<div v-else>
		<span class="user-interface-title">Авторизация</span>
		Пользовательский интерфейс доступен для авторизованного пользователя
		<div class="text-center">
			<button
					class="btn btn-primary"
					@click="openCloseBoxFunc"
			>
				Авторизоваться
			</button>
		</div>
		<Modal
				:showOpenModal="activeAuthModal"
				size="small"
				modal-id="auth-form"
				:re-calc-height="reCalc"
				@setReCalcValue="reCalcHeight"
				@toggleModal="toggleAuthModal"
		>
			<AuthComponent
					@reCalcHeight="reCalcHeight"
					@closeModal="toggleAuthModal"
			/>
		</Modal>
	</div>
</template>

<style lang="scss" scoped>

</style>
