<script setup>
import OrganizersAndGratitudeCard from '@/modules/boardGame/components/user/userCard/OrganizersAndGratitudeCard.vue';
import UserMessagesModal from '@/components/user/message/UserMessagesModal.vue';

import { computed } from "vue";

import { userMessage } from '@/composables/userMessage.js';
const { userMessagesModalRef, showUserMessagesModal } = userMessage();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const parsedSetting = ref(null);

const userIds = computed(() => {
	const jsonString = getSettingValue('event_organizers');

	if (!jsonString) {
		return;
	}

	let userIds = [];

	try {
		parsedSetting.value = JSON.parse(jsonString);
		userIds = parsedSetting.value.map(item => item.user_id);
	} catch (error) {
		console.error("Ошибка парсинга JSON:", error);
	}

	return userIds;
});

const requestName = 'getOrganizersAndGratitudeUsersData';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (!userIds.value) {
				return;
			}

			const response = await Promise.resolve(
					sendApiRequest(
							`user/get-by-ids/`,
							'GET',
							{
								userIds: userIds.value.join(','),
							},
							requestName,
							'fullscreenTransparent'
					)
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || []);

const unionData = computed(() => {
	const returnData = [];

	if (!parsedSetting.value) {
		return;
	}

	parsedSetting.value.forEach((item) => {
		returnData.push({
			name: item?.name,
			imageSrc: item?.imageSrc,
			title: item?.title,
			description: item?.description,
			user: fetchedData.value.find((user) => user.id === item.user_id),
		});
	});

	return returnData;
});
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="unionData && unionData?.length" class="wrapper">
		<OrganizersAndGratitudeCard
				v-for="(element, key) in unionData"
				:element="element"
				:key="key"
				@showUserMessagesModal="showUserMessagesModal"
		/>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Список пуст"
	/>

	<UserMessagesModal ref="userMessagesModalRef" />
</template>

<style lang="scss" scoped>
@import url('~/assets/scss/Fragments/profileLine.scss');

.wrapper {
	@apply grid grid-cols-12 gap-5;
}
</style>
