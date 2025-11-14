<script setup>
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';
import GameFinishForm from '@/modules/boardGame/components/game/GameFinishForm.vue';
import InviteToCoopForm from '@/modules/boardGame/components/game/InviteToCoopForm.vue';
import PlayerInteractionCard from '@/modules/boardGame/components/player-interactions/PlayerInteractionCard.vue';

import { inject } from "vue";

const layoutMethods = inject('layoutMethods')

const emit = defineEmits(['toggleFormVisible', 'updateData']);

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	currentGame: {
		type: Object,
		default: {},
	},
	player: {
		type: Object,
		default: {},
	},
	coopInteraction: {
		type: Array,
		default: [],
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
	},
	editListAvailable: {
		type: Boolean,
		default: false,
	},
});

const showForm = ref(false);
const type = ref(null);

const toggleFormVisible = (typeValue = null) => {
	showForm.value = !showForm.value;

	if (typeValue) {
		type.value = typeValue;
	}
}
const showTimer = computed(() => {
	let showTimer = true;

	if (props.currentGame.type === 0) {
		showTimer = false;
	}

	return showTimer;
});
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
			:showTimer="showTimer"
	/>

	<div v-if="currentGame.type === 0" class="item-box">
		Эта игра передана вам на прохождении другим участником ивента, при её прохождении вы не трекаете время.
		Но чтобы посчитать время, затраченное на прохождение вы можете создать отдельный таймер, используя страницу&nbsp;<nuxt-link class="underline" target="_blank" :to="`/e/${route.params.slug}/timers`">таймера</nuxt-link>
	</div>
	<div v-if="currentGame.type === 1" class="item-box">
		Это игра передана вам "Ультра мошной", при её рероле вы потеряете 70% от стоимости игры
	</div>

	<div class="mt-5" v-if="showActionButtons && !showForm">
		<button class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="toggleFormVisible(1)">Рерольнуть</button>
		<button v-if="currentGame.game.coop && coopInteraction.length === 0" class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="toggleFormVisible('coop')">Пригласить в кооп</button>
		<button class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="toggleFormVisible(2)">Игра пройдена</button>
		<button v-if="editListAvailable" class="btn btn-simple-1 mr-[1rem] w-full lg:w-auto" @click="emit('showEditList')">Редактировать списки</button>
	</div>
	<PlayerInteractionCard
			v-if="coopInteraction.length > 0 && !showForm"
			v-for="(element, key) in coopInteraction"
			:key="key"
			class="mt-4"
			:element="element"
			@update="emit('updateData')"
	/>
	<InviteToCoopForm
			v-if="showForm && type === 'coop' && coopInteraction.length === 0"
			:game="currentGame.game.game"
			:points="currentGame.game.computed_points ? currentGame.game.computed_points : currentGame.game.points"
			@toggleFormVisible="toggleFormVisible"
			@updateData="emit('updateData')"
	/>
	<GameFinishForm
			v-if="showForm && type !== 'coop'"
			:game="currentGame.game.game"
			:points="currentGame.game.computed_points ? currentGame.game.computed_points : currentGame.game.points"
			:rerollPenalty="currentGame.rerollPenalty"
			:streak="player.streak"
			:type="type"
			:gameType="currentGame.type"
			@toggleFormVisible="toggleFormVisible"
			@updateData="emit('updateData', $event)"
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
