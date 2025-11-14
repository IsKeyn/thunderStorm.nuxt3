<script setup>
import Auth from '@/modules/boardGame/components/user/Auth.vue';
import VerifyEmailBlock from "@/components/user/VerifyEmailBlock.vue";
import JoinTheGame from '@/modules/boardGame/components/user/JoinTheGame.vue';

import PromoPage from '@/modules/boardGame/components/steps/fragments/PromoPage.vue';
import PlayerSteps from '@/modules/boardGame/components/steps/fragments/PlayerSteps.vue';
import GameOver from '@/modules/boardGame/components/steps/fragments/GameOver.vue';

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

const route = useRoute();

const setPageNameFunc = (name) => {
	emit('setPageName', name);
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
					<JoinTheGame v-else />
				</template>
				<VerifyEmailBlock v-else />
			</div>
			<Auth
					v-else
					message="Для участия в ивенте войдите на сайт или зарегистрируйтесь"
			/>
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
					<JoinTheGame v-else />
				</template>
				<VerifyEmailBlock v-else />
			</div>
			<Auth
					v-else
					message="Для участия в ивенте войдите на сайт или зарегистрируйтесь"
			/>
		</template>
	</template>
	<template v-else>
		Ивент отключен
	</template>
</template>

<style lang="scss" scoped>

</style>
