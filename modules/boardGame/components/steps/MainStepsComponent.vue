<script setup>
import Auth from '@/modules/boardGame/components/user/Auth.vue';
import VerifyEmailBlock from "@/components/user/VerifyEmailBlock.vue";
import JoinTheGame from '@/modules/boardGame/components/user/JoinTheGame.vue';

import PromoPage from '@/modules/boardGame/components/steps/fragments/PromoPage.vue';
import PlayerSteps from '@/modules/boardGame/components/steps/fragments/PlayerSteps.vue';
import GameOver from '@/modules/boardGame/components/steps/fragments/GameOver.vue';
import RememberButton from '@/modules/boardGame/components/steps/fragments/RememberButton.vue';

import { ref } from "vue";
const emit = defineEmits(['setPageName']);

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	isEmailVerified,
	isAuthAndVerified,
	userStore,
} = userFunctions();

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
} = date();

import { animate } from '@/composables/animate.js';
const {
	scrollToElement,
} = animate();

const route = useRoute();

const setPageNameFunc = (name) => {
	emit('setPageName', name);
}

const showRememberButton = computed(() => {
	const returnData = {
		show: false,
		icon: ["fa-solid", "fa-gamepad"],
	};

	if (boardGameStore.boardGameInfo.status === 2 || boardGameStore.boardGameInfo.status === 1) {
		if (isAuth.value) {
			if (isEmailVerified.value) {
				if (Object.keys(userStore.player).length === 0) {
					returnData.show = true;
					// returnData.message = 'Вы не учавствуете в ивенте. Подтвердите участие';
					returnData.message = 'Учавствовать в ивенте';
				}
			} else {
				returnData.show = true;
				// returnData.message = 'Вы не учавствуете в ивенте. Подтвердите email';
				returnData.message = 'Учавствовать в ивенте';
			}
		} else {
			returnData.show = true;
			// returnData.message = 'Вы не учавствуете в ивенте. Авторизируйтесь';
			returnData.message = 'Учавствовать в ивенте';
		}
	}

	return returnData;
});

const scrollToJoinButton = () => {
	scrollToElement('eventJoinBox');
}
</script>

<template>
	<template v-if="boardGameStore.boardGameInfo.active">
		<GameOver v-if="boardGameStore.boardGameInfo.status === 0" />
		<template v-else-if="boardGameStore.boardGameInfo.status === 1">
			<PromoPage v-if="(!isAuth || !isEmailVerified) || Object.keys(userStore.player).length === 0" />
			<div v-if="isAuth">
				<template v-if="isEmailVerified">
					<PlayerSteps
							v-if="Object.keys(userStore.player).length > 0"
							@setPageName="setPageNameFunc($event)"
					/>
					<div v-else id="eventJoinBox">
						<JoinTheGame />
					</div>
				</template>
				<div v-else id="eventJoinBox">
					<VerifyEmailBlock />
				</div>
			</div>
			<div v-else id="eventJoinBox">
				<Auth message="Для участия в ивенте войдите на сайт или зарегистрируйтесь" />
			</div>
		</template>
		<template v-else-if="boardGameStore.boardGameInfo.status === 2">
			<PromoPage />
			<div v-if="isAuth">
				<template v-if="isEmailVerified">
					<div class="mt-4" v-if="Object.keys(userStore.player).length > 0">
						<template v-if="boardGameStore.boardGameInfo.started_at">
							Вы успешно зарегистрированы в ивенте, посетите эту страницу в день начала ивента - {{ getFormattedDate('d ru_mouths_name Y', boardGameStore.boardGameInfo.started_at) }}
						</template>
						<template v-else>
							Вы успешно зарегистрированы в ивенте
						</template>
					</div>
					<div v-else id="eventJoinBox">
						<JoinTheGame />
					</div>
				</template>
				<div v-else id="eventJoinBox">
					<VerifyEmailBlock />
				</div>
			</div>
			<div v-else id="eventJoinBox">
				<Auth message="Для участия в ивенте войдите на сайт или зарегистрируйтесь" />
			</div>
		</template>
	</template>
	<template v-else>
		Ивент отключен
	</template>
	<RememberButton
		v-if="showRememberButton.show"
		:data="showRememberButton"
		@clickFunc="scrollToJoinButton"
	/>
</template>

<style lang="scss" scoped>

</style>
