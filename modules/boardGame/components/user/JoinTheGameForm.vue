<script setup>
import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const requestInProgress = ref(false);

const goIn = async () => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
		}

		const response = await sendApiRequest('board-game/v2/player/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.status === 'error') {
				error(response.status_message);
			} else if (response.status === 'success') {
				if (!hasWebSocked()) refreshLayoutData();

				alert(response.status_message);
			}
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

// TODO добавить галочку с правили ивента
</script>

<template>
	<div class="text-center">
		<layout-buttons-ActionButton
				class="btn btn-primary"
				buttonName="Участвовать в ивенте"
				:actionInProgress="requestInProgress"
				@startAction="goIn()"
		/>
	</div>
</template>
