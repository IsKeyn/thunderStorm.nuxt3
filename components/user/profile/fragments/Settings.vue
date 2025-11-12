<script setup>
import FieldSettings from '@/components/user/profile/fragments/FieldSettings.vue';
import ChangePassword from '@/components/user/profile/fragments/ChangePassword.vue';
import QrCodeForAuth from '@/components/user/profile/fragments/QrCodeForAuth.vue';

const props = defineProps({
	pageForRedirect: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<FieldSettings />
	<ChangePassword />
	<QrCodeForAuth :pageForRedirect="pageForRedirect" />
</template>
