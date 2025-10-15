<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest, publicUrl } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const form = ref(
		{
			autoLoginUrl: {
				name: 'Ссылка авто-логина',
				value: '',
				type: 'text',
				placeholder: 'Нажмите кнопку сгенерировать, чтобы создать ссылку',
				validateRules: null,
				classes: 'w-full',
			},
		},
);

const requestInProgress = ref(false);

const generateLinkRequest = async () => {
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`admin/magical-link/generate/${route.params.slug}`, 'GET', {}, 'generateAutoLoginToken', '');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				requestInProgress.value = false;

				if (response.token) {
					form.value.autoLoginUrl.value = `${window.location.protocol}//${publicUrl.value}/auth/autologin/${response.token}`;
				} else {
					error('Токен не получен');
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
		<FormGenerator
				v-if="form.autoLoginUrl"
				name="autologin"
				class="w-full"
				:element="form.autoLoginUrl"
				:showTitle="false"
				:showCopyButton="true"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.autoLoginUrl.classes"
		/>
		<ActionButton
				buttonClasses="btn btn-simple"
				buttonName="сгенерировать"
				:actionInProgress="requestInProgress"
				@startAction="generateLinkRequest()"
		/>
	</div>
</template>

<style lang="scss" scoped></style>
