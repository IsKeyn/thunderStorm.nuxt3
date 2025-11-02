<script setup>
import StatusEffectCard from '@/modules/boardGame/components/statusEffect/StatusEffectCard.vue';

import { computed } from "vue";
const route = useRoute();

const props = defineProps({
	userName: {
		type: String,
		default: null,
	},
	canUse: {
		type: Boolean,
		default: false,
	},
	showUsedItemsBox: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: null,
	},
});

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const requestName = 'getBoardGamePlayerStatusEffectHistory';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/getStatusEffects/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, '')
				);

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const nonActiveSe = computed(() => {
	const grouped = {};

	if (fetchedData.value) {
		fetchedData.value.filter(item => !item.active).forEach((item) => {
			if (item.statusEffect) {
				if (grouped[item.statusEffect.id]) {
					grouped[item.statusEffect.id].statusEffect.quantity++;
				} else {
					grouped[item.statusEffect.id] = { ...item };
					grouped[item.statusEffect.id].statusEffect.quantity = 1;
				}
			}
		});
	}

	return Object.values(grouped).sort(function(a, b) {
		return b.statusEffect.quantity - a.statusEffect.quantity;
	});
});

const updateList = () => {
	refresh();
}

// TODO только текущий пользователь может использовать статус эффекты
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<div
			v-else-if="fetchedData && fetchedData.length > 0"
			:class="['inventory', classes]"
	>
		<div class="box mb-[2rem]">
			<h2 class="inv-title">Активные статус эффекты</h2>
			<span v-if="fetchedData && fetchedData.filter(item => item.active).length === 0">У игрока нет активных статус эффектов</span>
			<div class="wrapper">
				<StatusEffectCard
						v-for="(element, key) in fetchedData.filter(item => item.active)"
						:key="key"
						:element="element"
						:useLightBox="true"
						:showControlPanel="canUse"
						@updateList="updateList"
				/>
			</div>
		</div>
		<div
				v-if="showUsedItemsBox"
				class="box"
		>
			<h2 class="inv-title">Не активные статус эффекты</h2>
			<span v-if="nonActiveSe.length === 0">У игрока нет закрытых статус эффектов</span>
			<div class="wrapper">
				<StatusEffectCard
						v-for="(element, key) in nonActiveSe"
						:key="key"
						:element="element"
						:useLightBox="true"
						:showControlPanel="true"
				/>
			</div>
		</div>
	</div>
	<template v-else>
		Статус эффекты отсутствуют
	</template>
</template>

<style lang="scss" scoped>
.inventory {
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
