<script setup>
import PlayerInteractionCard from '@/modules/boardGame/components/player-interactions/PlayerInteractionCard.vue';

import { computed, onMounted, ref } from "vue";

const { subscribe, unsubscribe } = useWebSocket();
const runtimeConfig = useRuntimeConfig();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { userFunctions } from '@/composables/userFunctions.js';
const { userStore } = userFunctions();

const props = defineProps({
	user_id: {
		type: Number,
		default: null,
	},
	checkCondition: {
		type: Boolean,
		default: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
	showDescription: {
		type: Boolean,
		default: true,
	},
	listenUpdates: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: null,
	},
});

const requestName = 'getBoardGamePlayerInteractions';
const hiddenRefresh = ref(false);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const body = {
				checkCondition: props.checkCondition,
				userId: props.user_id,
				active: props.active,
			};

			const response = await Promise.resolve(
					sendApiRequest(
							`board-game/v2/player/interactions/get/${route.params.slug}/`,
							'GET',
							body,
							requestName,
							''
					)
			);

			hiddenRefresh.value = false;
			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = ref([]);

// Инициализация из useAsyncData
watchEffect(() => {
	fetchedData.value = requestData.value?.data || [];
});

const incoming = computed(() => {
	return fetchedData.value.filter(item => item.created_by !== props.user_id);
});

const outgoing = computed(() => {
	return fetchedData.value.filter(item => item.created_by === props.user_id);
});

const description = 'Страница взаимодействия с другими игроками. На этой странице вы можете отслеживать свои запросы на взаимодействие с другими игроками, а также принимать решения о входящих предложениях.';

onMounted(async () => {
	if (isAuth.value
			&& Object.keys(userStore.user).length
			&& props.listenUpdates
			&& runtimeConfig.public.hasWebSockedServer
	) {
		const userId = userStore.user?.id;

		const { unsubscribe: stop, subscriptionId } = subscribe(
				`App.Models.User.${userId}`,
				'BoardGame.PlayerInteractions',
				(data) => {
					if (data.status === 'update') {
						hiddenRefresh.value = true;
						refresh();
					}
				}
		);
	}
});
</script>

<template>
	<layout-InfoBlock
			v-if="showDescription"
			:text="description"
			classes="!mb-6"
	/>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
			theme="image"
			:themeType="9"
	/>
	<div
			v-else-if="fetchedData && fetchedData.status === 'error' && fetchedData.status_message"
			class="item-box"
	>
		{{ fetchedData.status_message }}
	</div>
	<div
			v-else-if="fetchedData.length"
			:class="['interactions', classes]"
	>
		<div class="box">
			<h2 class="inv-title">Исходящие запросы</h2>
			<span v-if="outgoing.length === 0">Запросов нет</span>
			<div class="wrapper">
				<PlayerInteractionCard
						v-for="(element, key) in outgoing"
						:key="key"
						:element="element"
						:user_id="user_id"
						:checkCondition="checkCondition"
						@update="refresh"
				/>
			</div>
		</div>
		<div class="box mb-[2rem]">
			<h2 class="inv-title">Входящие запросы</h2>
			<span v-if="incoming.length === 0">Запросов нет</span>
			<div class="wrapper">
				<PlayerInteractionCard
						v-for="(element, key) in incoming"
						:key="key"
						:element="element"
						:user_id="user_id"
						:checkCondition="checkCondition"
						@update="refresh"
				/>
			</div>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Взаимодействия отсутствуют"
	/>
</template>

<style lang="scss" scoped>
.interactions {
	@apply block lg:flex justify-center gap-4 mb-4;

	.box {
		@apply mb-[1rem] lg:mb-0 w-full lg:w-1/2;

		.wrapper {
			@apply h-[600px] overflow-auto;
		}
	}
}

.inv-title {
	@apply font-bold mb-4 uppercase;
}
</style>
