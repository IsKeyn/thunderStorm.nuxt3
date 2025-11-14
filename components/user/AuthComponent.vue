<script setup>
import { watch, onMounted } from "vue";
import LoginForm from '@/components/forms/LoginForm.vue';
import RecoveryPasswordForm from '@/components/forms/RecoveryPasswordForm.vue';
import RegistrationForm from '@/components/forms/RegistrationForm.vue';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm.vue';

const props = defineProps({
	title: {
		type: String,
		default: 'Авторизация',
	},
	actionType: {
		type: String,
		default: 'login',
	},
	registerOnEventBySlug: {
		type: String,
		default: null,
	},
});

const emit = defineEmits(['сlosureFunc', 'reCalcHeight', 'closeModal']);

const actionType = ref('login');
const actionTypeTitle = ref('Авторизация');

const setActionType = (paramsObj) => {
	actionType.value = paramsObj.value;
	actionTypeTitle.value = paramsObj.title;

	emit('reCalcHeight');
}

setActionType({ value: props.actionType, title: props.title });

watch(() => props.actionType, () => {
	setActionType({ value: props.actionType, title: props.title });
});
</script>

<template>
	<div>
		<h3 class="modal-title">{{ actionTypeTitle }}</h3>
		<LoginForm
				v-if="actionType === 'login'"
				:registerOnEventBySlug="registerOnEventBySlug"
				@setActionType="setActionType"
				@сlosureFunc="emit('сlosureFunc')"
		/>
		<RecoveryPasswordForm
				v-if="actionType === 'recovery_password'"
				@setActionType="setActionType"
				@closeModal="emit('closeModal')"
		/>
		<RegistrationForm
				v-if="actionType === 'registration'"
				:registerOnEventBySlug="registerOnEventBySlug"
				@setActionType="setActionType"
		/>
		<ResetPasswordForm
				v-if="actionType === 'reset_password'"
				description="Введите новый пароль"
				@setActionType="setActionType"
				@closeModal="emit('closeModal')"
		/>
	</div>
</template>
