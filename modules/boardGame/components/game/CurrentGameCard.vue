<script setup>
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';
import GameFinishForm from '@/modules/boardGame/components/game/GameFinishForm.vue';

import { inject } from "vue";

const emit = defineEmits(['setStep', 'toggleFormVisible']);

const route = useRoute();

const layoutMethods = inject('layoutMethods')

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	currentGame: {
		type: Object,
		default: {},
	},
	showTitle: {
		type: Boolean,
		default: true,
	},
	showActionButtons: {
		type: Boolean,
		default: false,
	},
	showOtherPlayersActions: {
		type: Boolean,
		default: false,
	}
});


const showFinishGameForm = ref(false);
const type = ref(null);

const toggleFormVisible = (typeValue = null) => {
	showFinishGameForm.value = !showFinishGameForm.value;

	if (typeValue) {
		type.value = typeValue;
	}
}
</script>

<template>
	<span
			v-if="showTitle"
			class="user-interface-title text-left"
	>
		Ваша текущая игра
	</span>

	<GameCard
			:element="currentGame"
			theme="CurrentGame"
			:showStatusBar="false"
	/>

	<div class="mt-5" v-if="showActionButtons && !showFinishGameForm">
		<button class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="toggleFormVisible(1)">Рерольнуть</button>
		<button class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="toggleFormVisible(3)">Отдал</button>
		<button class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="toggleFormVisible(2)">Игра пройдена</button>
		<button class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="emit('showEditList')">Редактировать списки</button>
	</div>
	<GameFinishForm
			v-if="showFinishGameForm"
			:boardGameId="boardGameId"
			:game="currentGame.game.game"
			:points="currentGame.game.points"
			:type="type"
			@toggleFormVisible="toggleFormVisible"
	/>
	<template v-if="showOtherPlayersActions">
		<span class="user-interface-title text-left">Действия других игроков с данной игрой</span>
		<GameCard
				v-if="currentGame.other_players_actions.length > 0"
				v-for="(element, key) in currentGame.other_players_actions"
				:key="key"
				:element="element"
				theme="PlayerActionWithGame"
				:showCover="false"
		/>
		<div v-else class="item-box">
			Другим игрокам эта игра не выпадала
		</div>
	</template>
</template>

<style lang="scss" scoped>
.current-game {
	@apply lg:flex;

	img {
		@apply
			mx-auto mb-4 lg:m-0 lg:mr-[1rem]
			w-1/2 lg:w-1/6 object-contain cursor-pointer;
	}

	.description-block {
		.title {
			@apply block mb-[1.3rem];
		}

		span.line-info {
			@apply block mb-[0.3rem];
		}

		a {
			@apply text-[var(--main-text-color)];
		}
	}
}

.hover-line {
	@apply cursor-pointer;

	&:hover {
		@apply text-[var(--main-hover-color)];
	}
}
</style>
