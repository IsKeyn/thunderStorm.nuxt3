<script setup>
import FieldSettings from '@/components/user/profile/fragments/FieldSettings.vue';
import ChangePassword from '@/components/user/profile/fragments/ChangePassword.vue';
import QrCodeForAuth from '@/components/user/profile/fragments/QrCodeForAuth.vue';

const emit = defineEmits(['refresh']);

const props = defineProps({
	pageForRedirect: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<ui-itemBox
			classes="green"
			message="Вы можете изменить аватар, нажав на его изображение в вашем профайле"
	/>
	<FieldSettings @refresh="$emit('refresh')" />
	<ChangePassword />
	<QrCodeForAuth :pageForRedirect="pageForRedirect" />
</template>
