<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import StatusEffectCard from '@/modules/boardGame/components/statusEffect/StatusEffectCard.vue';

const emit = defineEmits(['debugSetStatusEffect']);

import { computed, ref } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	showDebugControlPanel: {
		type: Boolean,
		default: false,
	},
});

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Начните вводить название статус эффекта, для поиска',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

const route = useRoute();
const requestName = 'getBoardGameSeList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/status-effect/list/${route.params.slug}/`, 'GET', {}, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const seList = computed(() => requestData.value?.data || null);

const filteredSe = computed(() => {
	return seList.value.filter((item) => {
		return item.statusEffect.name.toLowerCase().includes(form.value.searchLine.value ? form.value.searchLine.value.toLowerCase() : '');
	});
});
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else class="wrapper">
		<FormGenerator
				v-if="form.searchLine"
				name="search"
				class="w-1/2"
				:element="form.searchLine"
				:showTitle="false"
				:clearButton="true"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.searchLine.classes"
		/>
		<StatusEffectCard
				v-if="seList && seList.length > 0"
				v-for="(element, key) in filteredSe"
				:key="key"
				:element="{statusEffectBind: element}"
				:useLightBox="true"
				:showDropChance="false"
				:showControlPanel="showControlPanel"
				:showDebugControlPanel="showDebugControlPanel"
				@debugSetStatusEffect="$emit('debugSetStatusEffect', $event)"
		/>
		<ui-itemBox
				v-else
				classes="red"
				message="Предметов нет"
		/>
	</div>
</template>
