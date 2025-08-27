<script setup>
import UserInfoBlock from '@/modules/boardGame/components/user/UserInfoBlock.vue';

import { date } from '@/composables/date.js';
import {computed} from "vue";
const {
	getFormattedDate
} = date();

const props = defineProps({
	boardGameInfo: {
		type: Object,
		default: {},
		require: true,
	},
});

const route = useRoute();

const statusName = computed(() => {
	return props.boardGameInfo.status ? 'Проводится' : 'Окончено';
});

const dateString = computed(() => {
	let returnData = '(';

	if (props.boardGameInfo.started_at) {
		returnData += getFormattedDate('d ru_mouths_name Y', props.boardGameInfo.started_at);
	}

	if (props.boardGameInfo.started_at && props.boardGameInfo.ended_at) {
		returnData += ' - ';
	}

	if (props.boardGameInfo.ended_at) {
		returnData += getFormattedDate('d ru_mouths_name Y', props.boardGameInfo.ended_at);
	}

	returnData += ')';

	return returnData;
});
</script>

<template>
	<header>
		<div class="left-block">
			<span v-if="boardGameInfo.name" class="title">
				{{ boardGameInfo.name }}
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
					:iconText="statusName"
					:buttonText="dateString"
					closeWidthClass="w-[140px]"
					openType="t480"
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


