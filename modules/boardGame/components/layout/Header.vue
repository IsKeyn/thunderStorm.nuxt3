<script setup>
import UserInfoBlock from '@/modules/boardGame/components/user/UserInfoBlock.vue';

import { computed } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const {
	statusName,
	dateString,
	getStatusName,
	getDateString,
} = boardGame(boardGameStore.boardGameInfo);

const route = useRoute();

const playersOnline = computed(() => {
	boardGameStore.playersOnline.length > 0
});
</script>

<template>
	<header>
		<div class="left-block">
			<span v-if="boardGameStore.boardGameInfo.name" class="title">
				{{ boardGameStore.boardGameInfo.name }}
			</span>

			<ui-IconButton
					class="ml-[1rem]"
					:faIcon="['fab', 'telegram']"
					buttonText="Телеграм"
					href="https://t.me/game_events_tr"
					target="_blank"
			/>

			<ui-IconButton
					:faIcon="['fas', 'book-open-reader']"
					buttonText="Правила и описание"
					:routerLinkUrl="`/e/${route.params.slug}/rules/`"
			/>

			<ui-IconButton
					iconType="text"
					:iconText="getStatusName(boardGameStore.boardGameInfo)"
					:buttonText="getDateString(boardGameStore.boardGameInfo)"
					closeWidthClass="w-[140px]"
					openType="t480"
			/>

			<ui-IconButton
					v-if="Object.keys(boardGameStore.playersOnline).length > 0"
					:faIcon="['fa-brands', 'fa-twitch']"
					:hasFade="true"
					buttonText="Участники онлайн"
					:routerLinkUrl="`/e/${route.params.slug}/player/`"
			/>
		</div>
		<div class="right-block">
			<UserInfoBlock />


<!--			<Rules-->
<!--					:boardGameId="boardGameInfo.id"-->
<!--					:boardGameInfo="boardGameInfo"-->
<!--			/>-->
<!--			<Games-->
<!--					:boardGameId="boardGameInfo.id"-->
<!--			/>-->
<!--			<Items-->
<!--					:boardGameId="boardGameInfo.id"-->
<!--			/>-->
<!--			<StatsButtonAndModal-->
<!--					:boardGameId="boardGameInfo.id"-->
<!--					:boardGameInfo="boardGameInfo"-->
<!--					@showPlayer="showPlayer"-->
<!--			/>-->
<!--			<ui-IconButton-->
<!--					class="ml-[1rem]"-->
<!--					:faIcon="['fab', 'twitch']"-->
<!--					buttonText="Расширение"-->
<!--					href="https://dashboard.twitch.tv/extensions/3cn0qf9xaa13w6wj7za4nmxl2qn0ju-1.0.1"-->
<!--					target="_blank"-->
<!--			/>-->
<!--			<ui-IconButton-->
<!--					class="ml-[1rem]"-->
<!--					:faIcon="['fab', 'telegram']"-->
<!--					buttonText="Телеграм"-->
<!--					href="https://t.me/game_events_tr"-->
<!--					target="_blank"-->
<!--			/>-->
		</div>
	</header>
</template>

<style lang="scss" scoped>
header {
	@apply
		pt-[1rem] pb-[1rem] pl-[var(--main-left-padding)] pr-[var(--main-right-padding)]
		block lg:flex lg:items-center gap-2 text-center lg:text-left
	;

	border-bottom: 1px solid var(--second-border-color);

	.left-block {
		@apply w-1/3 flex items-center gap-2;

		.date-block,
		.status {
			@apply bg-[var(--second-bg-color)] text-[var(--main-dark-text-color)] p-[0.4rem];
		}
	}

	.right-block {
		@apply
			flex flex-wrap
			w-full lg:w-2/3
			justify-center lg:justify-end
		;
	}
}



.show-board-button {
	@apply hidden lg:block 2xl:hidden;
}

.main-dashboard-box {
	@apply block lg:grid grid-cols-12;

	.user-interface-box {
		@apply lg:col-span-6 2xl:col-span-2 mr-0 lg:mr-[2rem];

		&.show-board {
			@apply hidden;
		}
	}

	.board-box {
		@apply
		col-span-4 lg:hidden 2xl:block 2xl:col-span-8
		;

		margin: 0 auto;

		&.show-board {
			@apply col-span-12 block;
		}
	}

	.info-box {
		@apply lg:col-span-6 2xl:col-span-2 ml-0 lg:ml-[2rem];

		&.show-board {
			@apply hidden;
		}
	}
}
</style>

<style lang="scss">
header {
	.menu-block {
		.btn {
			@apply text-center;

			span.button-text {
				@apply hidden xl:block 2xl:inline;
			}
		}
	}
}
</style>


