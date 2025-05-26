<script setup>
import GameFinishForm from '@/components/boardGame/game/GameFinishForm.vue';
import LightBox from '@/components/media/LightBox.vue'

const emit = defineEmits(['showPlayer', 'setStep', 'toggleFormVisible', 'updateBoardGameInfo']);

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage,
} = lightBox();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	currentGame: {
		type: Object,
		default: {},
	},
	players: {
		type: Object,
		default: {},
	},
	showTitle: {
		type: Boolean,
		default: true,
	},
	showInfoButtons: {
		type: Boolean,
		default: true,
	},
	showActionButtons: {
		type: Boolean,
		default: false,
	},
});

const getPlayerById = (id) => {
	let player = props.players.filter((item) => item.user_id === id);

	if (player && player[0]) {
		return player[0];
	}
};

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
	<div
			v-if="Object.keys(currentGame).length > 0"
			class="current-game"
	>
		<img
				v-if="showTitle && currentGame.game.game?.covers[0]?.src"
				:src="getResizeImg(currentGame.game.game.covers[0])"
				@click="setOpenedImage(currentGame.game.game.covers[0])"
		>
		<div class="description-block">
			<span class="title">{{ currentGame.game.game.name }}</span>
			<span class="line-info" v-if="currentGame.game.platform">Платформа: {{ currentGame.game.platform.name }}</span>
			<span class="line-info" v-if="currentGame.game.game?.release_dates[0]?.date">Год релиза: {{ getFormattedDate('Y', currentGame.game.game.release_dates[0].date) }}</span>
			<span class="line-info" v-if="currentGame.game.points">Количество очков за игру: {{ currentGame.game.points }}</span>
			<span
					v-if="currentGame.game.added_by && getPlayerById(currentGame.game.added_by)"
					class="line-info"
					@click="$emit('showPlayer', currentGame.game.added_by)"
			>
				Добавил: <span class="hover-line">{{ getPlayerById(currentGame.game.added_by).user.name }}</span>
			</span>
			<span class="line-info" v-if="currentGame.game.description">{{ currentGame.game.description }}</span>
			<div v-if="showInfoButtons">
				<div class="mb-2">Ссылки:</div>
				<ul>
					<li>
						<a
								class="mr-[1rem]"
								:href="`https://www.youtube.com/results?search_query=${currentGame.game.game.name} longplay`"
								target="_blank"
						>Лонгплей</a>
					</li>
					<li v-if="currentGame.game.game.slug">
						<a
								class="mr-[1rem]"
								:href="`/game/${currentGame.game.game.slug}`"
								target="_blank"
						>Открыть страницу игры</a>
					</li>
				</ul>
			</div>
			<div v-if="showActionButtons && !showFinishGameForm">
				<button class="btn btn-simple-1 mr-[1rem]" @click="toggleFormVisible(1)">Рерольнуть</button>
				<button class="btn btn-simple-1 mr-[1rem]" @click="toggleFormVisible(3)">Отдал</button>
				<button class="btn btn-simple-1 mr-[1rem]" @click="toggleFormVisible(2)">Игра пройдена</button>
				<button class="btn btn-simple-1 mr-[1rem]" @click="emit('showEditList')">Редактировать списки</button>
			</div>
		</div>
	</div>
	<GameFinishForm
			v-if="showFinishGameForm"
			:boardGameId="boardGameId"
			:game="currentGame.game.game"
			:points="currentGame.game.points"
			:type="type"
			@toggleFormVisible="toggleFormVisible"
			@updateBoardGameInfo="emit('updateBoardGameInfo')"
	/>
	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>


<style lang="scss" scoped>
.current-game {
	@apply flex;

	img {
		@apply w-1/6 object-contain mr-[1rem] cursor-pointer;
	}

	.description-block {

		.title {
			@apply block mb-[1.3rem];
		}

		span.line-info {
			@apply block mb-[0.3rem];
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
