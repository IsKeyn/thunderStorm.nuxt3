<script setup>
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest, publicUrl } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const requestInProgress = ref(false);

const logout = async () => {
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`admin/user/full-logout/${route.params.slug}`, 'GET', {}, 'fullLogout', '');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				requestInProgress.value = false;

				if (response) {
					alert('Разлогинен');
				}
			}
		} else {
			error('Пустой ответ');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="flex">
		<ActionButton
				buttonClasses="btn btn-simple"
				buttonName="Разлогинить"
				:actionInProgress="requestInProgress"
				@startAction="logout()"
		/>
	</div>
</template>

<style lang="scss" scoped></style>
