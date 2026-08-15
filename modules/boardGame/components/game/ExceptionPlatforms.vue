<script setup>
import Modal from '@/components/modals/Modal.vue';
import ElementWithRepeater from '@/components/forms/fragments/ElementWithRepeater.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { ref, watch } from "vue";

const emit = defineEmits(['updateData']);

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	params: {
		type: Object,
		default: { additionalDataKeys: [ "platforms" ] } ,
	},
	additionalData: {
		type: Object,
		default: {},
	},
	defaultValues: {
		type: Array,
		default: [],
	},
});

const activeModal = ref(false);

const toggleModal = () => {
	activeModal.value = !activeModal.value;
}

// Один элемент репитора
const repeaterItem = {
	platforms: {
		name: 'platforms',
		type: 'select-with-search',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
		],
		value: null,
		placeholder: 'Платформа',
	},
};

const value = ref([]);

const setValue = () => {
	if (userStore?.player?.settings?.exceptionPlatforms) {
		const settingValue = [];

		userStore.player.settings.exceptionPlatforms.forEach((item) => {
			if (item) {
				settingValue.push({ platforms: item });
			}
		});

		if (settingValue.length) {
			value.value = [ ...settingValue ];
		}
	}
}

setValue ();

watch(() => value.value, () => {
	console.log(value.value);
	checkPlatforms();
}, { deep: true });

const errorMessages = ref([]);

const checkPlatforms = () => {
	errorMessages.value = [];

	const values = [];

	value.value.forEach((item) => {
		if (values.includes(item.platforms)) {
			errorMessages.value.push('Вы не можете исключить 2 одинаковые платформы');
		} else if (item.platforms) {
			values.push(item.platforms);
		}
	});
}

const penaltyMessage = computed(() => {
	switch (value.value.length) {
		case 0:
		case 1:
			return 'Без изменений очков за игру'
		case 2:
			return 'На 10% меньше очков за игру'
		case 3:
			return 'На 20% меньше очков за игру'
	}
});

const requestInProgress = ref(false);

const saveData = () => {
	const values = [];

	value.value.forEach((item) => {
		if (values.includes(item.platforms)) {
			errorMessages.value.push('Вы не можете исключить 2 одинаковые платформы');
		} else if (item.platforms) {
			values.push(item.platforms);
		}
	});

	if (errorMessages.value.length) {
		errorMessages.value.forEach((message) => {
			error(message);
		});

		return;
	}

	sendRequest(values);
}

const sendRequest = async (platforms) => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
			settingName: 'exceptionPlatforms',
			settingValue: platforms,
		};

		const response = await sendApiRequest(`board-game/v2/player/setSetting/${route.params.slug}`, 'POST', body, 'savePlayerSettingsRequest', '');

		requestInProgress.value = false;

		if (!response) {
			error('Не получен ответ от сервера');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		if (response.message) {
			alert(response.message);
		}

		if (!hasWebSocked()) refreshLayoutData();

		await toggleModal();
		emit('updateData');
	} catch (e) {
		requestInProgress.value = false;
		error(e);
	}
}
</script>

<template>
	<div class="item-box justify-between">
		<span>Вы можете исключить из рулетки платформы, игры на которых вы играть не желаете, однако помните, у такого решения есть цена</span>
		<button class="btn btn-simple" @click="toggleModal">Открыть меню исключения</button>
	</div>

	<Modal
			:showOpenModal="activeModal"
			size="full-width"
			modalId="exception-platforms-modal"
			@toggleModal="toggleModal"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Исключение платформ</h3>
			<div class="link-parent-box">
				<div class="mb-2">
					Вы можете исключить до 3-х платформ из общего пула рулетки. Исключение одной платформы - бесплатно, исключение каждой последующией -10% от очков пройденной игры.
					То есть, если вы исключите 3 платформы из пула игр, то вы будите получать на 20% меньше очков за пройденную игру.
				</div>
				<div>
					PS: Если платформа исключена, но на вас лежит статус эффект, который обязывает крутить игру на данной платформе, платформа все равно появится в пуле
				</div>
				<ui-itemBox
						v-for="(error, key) in errorMessages"
						:key="key"
						classes="red"
						:message="error"
				/>
				<ElementWithRepeater
						v-model="value"
						name="Исключенные платформы"
						:repeaterItem="repeaterItem"
						:params="params"
						:additionalData="{ platforms: JSON.parse(getSettingValue('eventGamePlatforms')) }"
						:defaultValues="defaultValues"
						:maxElements="3"
						fieldClasses="col-span-11"
						:hideCopyButton="true"
				/>
				<ui-itemBox
						classes="green"
						:message="penaltyMessage"
				/>
				<ActionButton
						buttonName="Сохранить"
						buttonClasses="btn btn-simple-1 min-w-24"
						:actionInProgress="requestInProgress"
						:disabled="errorMessages.length"
						@startAction="saveData()"
				/>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.item-box {
	@apply flex items-center rounded-none gap-4;
}
</style>
