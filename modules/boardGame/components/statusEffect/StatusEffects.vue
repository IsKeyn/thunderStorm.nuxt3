<script setup>
import StatusEffectCard from '@/modules/boardGame/components/statusEffect/StatusEffectCard.vue';

import { computed } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

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
	groupUnusedSe: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: null,
	},
});

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

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);

const unusedSe = computed(() => {
	const grouped = {};

	if (fetchedData.value) {
		fetchedData.value.filter(item => item.active).forEach((item) => {
			// ИСПРАВЛЕНИЕ: используем ?. чтобы избежать ошибки, если statusEffectBind === null
			const effect = item.statusEffectBind?.statusEffect;

			if (effect) {
				if (grouped[effect.id]) {
					grouped[effect.id].statusEffectBind.statusEffect.quantity++;
				} else {
					grouped[effect.id] = { ...item };
					grouped[effect.id].statusEffectBind.statusEffect.quantity = 1;
				}
			}
		});
	}

	return Object.values(grouped).sort((a, b) => {
		// На всякий случай добавим ?. и в сортировку
		const qtyA = a.statusEffectBind?.statusEffect?.quantity || 0;
		const qtyB = b.statusEffectBind?.statusEffect?.quantity || 0;
		return qtyB - qtyA;
	});
});

const nonActiveSe = computed(() => {
	const grouped = {};

	if (fetchedData.value) {
		fetchedData.value.filter(item => !item.active).forEach((item) => {
			// ИСПРАВЛЕНИЕ: используем ?.
			const effect = item.statusEffectBind?.statusEffect;

			if (effect) {
				if (grouped[effect.id]) {
					grouped[effect.id].statusEffectBind.statusEffect.quantity++;
				} else {
					grouped[effect.id] = { ...item };
					grouped[effect.id].statusEffectBind.statusEffect.quantity = 1;
				}
			}
		});
	}

	return Object.values(grouped).sort((a, b) => {
		const qtyA = a.statusEffectBind?.statusEffect?.quantity || 0;
		const qtyB = b.statusEffectBind?.statusEffect?.quantity || 0;
		return qtyB - qtyA;
	});
});

const updateList = () => {
	refresh();
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div
			v-else-if="fetchedData && fetchedData.length"
			:class="['inventory', classes]"
	>
		<div class="box mb-[2rem]">
			<h2 class="inv-title">Активные статус эффекты</h2>
			<span v-if="fetchedData && fetchedData.filter(item => item.active).length === 0">У игрока нет активных статус эффектов</span>
			<div class="wrapper">
				<StatusEffectCard
						v-for="(element, key) in groupUnusedSe ? unusedSe : fetchedData.filter(item => item.active)"
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
	<ui-itemBox
			v-else
			classes="red"
			message="Статус эффекты отсутствуют"
	/>
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
