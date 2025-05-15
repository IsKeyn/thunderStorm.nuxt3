<script setup>
import {ref, watch} from 'vue'

import Modal from '@/components/modals/Modal.vue';
import ChoiceAlertCard1 from '@/components/notifications/cards/ChoiceAlertCard1.vue';

import { useNotificationsStore } from '@/stores/notifications';

const useNotifications = useNotificationsStore();

const errors = computed(() => {
	return useNotifications.notifications.filter((item, index) => {
		if (item.type === 'error') {
			item.id = index;
			return item;
		}
	});
});

const alerts = computed(() => {
	return useNotifications.notifications.filter((item, index) => {
		if (item.type === 'alert') {
			item.id = index;
			return item;
		}
	});
});

const choiceAlerts = computed(() => {
	return useNotifications.notifications.filter((item, index) => {
		if (item.type === 'choiceAlert') {
			item.id = index;
			return item;
		}
	});
});

watch(useNotifications.notifications, async (newValue) => {
	if (newValue) {
		newValue.forEach((item, index) => {
			if (!item.hasOwnProperty('active')) {
				useNotifications.changeNotification({ key: index, prop: 'active', value: true });

				const rawItem = toRaw(item);

				if (rawItem.sound) {
					setTimeout(() => {
						if (notificationSound.value) {
							notificationSound.value.currentTime = 0
							notificationSound.value.play()
						}
					}, 1000);
				}

				if (rawItem.time) {
					setTimeout(() => {
						useNotifications.changeNotification({ key: index, prop: 'active', value: false });

						if (rawItem.func) {
							rawItem.func();
						}
					}, rawItem.time);
				}
			}
		});
	}
});

const setStyle = (key) => {
	let returnData = {};

	if (useNotifications.notifications[key] && useNotifications.notifications[key].color) {
		returnData.background = useNotifications.notifications[key].color;
	}

	return returnData;
}

const hideNotification = (key) => {
	useNotifications.changeNotification({ key, prop: 'active', value: false });
}

const getSaveErrorMessage = (result) => {
	if (result === true) {
		return 'Ошибка сохранена в базу данных';
	} else {
		return 'Не удалось сохранить ошибку в базу данных';
	}
}

const getCardType = (cardName) => {
	switch (cardName) {
		case 'ChoiceAlertCard1': return ChoiceAlertCard1;
	}
}

const notificationSound = ref(null);

const onClickHandler = (item) => {
	if (item.onClickFunc) {
		hideNotification(item.id);
		item.onClickFunc();
	} else {
		hideNotification(item.id);
	}
}
</script>

<template>
	<div>
		<div
				v-for="alert in alerts"
				v-show="alert.active"
				class="alert-box"
				:style=setStyle(alert.id)
		>
			<span class="w-[30px] text-left">
				<font-awesome-icon :icon="['fas', 'exclamation']" class="font-[35px]" />
			</span>
			<span class="message">
				{{ alert.message }}
			</span>
			<span class="w-[30px] text-right">
				<font-awesome-icon
						:icon="['fass', 'xmark']"
						class="cursor-pointer"
						@click="onClickHandler(alert)"
				/>
			</span>
		</div>

		<div class="error-box">
			<div
					v-for="error in errors"
					v-show="error.active"
					class="wrap"
					@click="onClickHandler(error)"
					:style=setStyle(error.id)
			>
				<font-awesome-icon :icon="['fas', 'circle-exclamation']" beat-fade size="2xl" />{{ error.currentTime }} : {{ error.message }}
				<template v-if="typeof(error.saveErrorResult) === 'boolean'">
					<div class="mt-2 font-bold">{{ getSaveErrorMessage(error.saveErrorResult) }}</div>
				</template>
			</div>
		</div>

		<div v-for="choiceAlert in choiceAlerts">
			<Modal
					:showOpenModal="choiceAlert.active"
					:canClose="false"
					size="small"
					overlayClasses="z-[1000]"
			>
				<component
						:is="getCardType(choiceAlert.card)"
						:item="choiceAlert"
						@click="onClickHandler(choiceAlert)"
				/>
			</Modal>
		</div>

		<audio ref="notificationSound" src="/sounds/sh2-recieve-item.mp3"></audio>
	</div>
</template>
