<script setup>
import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';
import VerifyEmailBlock from "@/components/user/VerifyEmailBlock.vue";
import UserInfo from '@/components/boardGame/user/UserInfo.vue';
import GoInThisGame from '@/components/boardGame/user/GoInThisGame.vue';
import Inventory from '@/components/boardGame/inventory/Inventory.vue';
import Dices from '@/components/boardGame/Dices.vue';
import Points from '@/components/boardGame/user/Points.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { roles } from '@/composables/roles.js';
const { hasRole } = roles();

const emit = defineEmits(['fetchLogs', 'updateBoardGameInfo']);

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
</script>

<template>
	<div v-if="userStore.user && Object.keys(userStore.user).length > 0">
		<template v-if="userStore.user.email_verified_at">
			<UserInfo
					@updateBoardGameInfo="emit('updateBoardGameInfo')"
			/>
			<GoInThisGame
					v-if="!alreadyInGame"
					:boardGameId="boardGameId"
					:boardGameInfo="boardGameInfo"
					@updateBoardGameInfo="emit('updateBoardGameInfo')"
			/>
			<template v-else>
				<Dices
						:boardGameId="boardGameId"
						@fetchLogs="emit('fetchLogs')"
				/>
				<Points
						:boardGameId="boardGameId"
						:boardGameInfo="boardGameInfo"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
						@fetchLogs="emit('fetchLogs')"
				/>
				<span class="user-interface-title">Инвентарь</span>
				<Inventory
						:boardGameId="boardGameId"
						@fetchLogs="emit('fetchLogs')"
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
					class="btn btn-primary block"
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
