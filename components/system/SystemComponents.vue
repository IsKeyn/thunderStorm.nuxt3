<script setup>
import UserSystemComponent from '@/components/user/UserSystemComponent.vue';
import SettingsComponent from '@/components/system/SettingsComponent.vue';
import UserNotifications from '@/components/user/notifications/UserNotifications.vue';
</script>

<template>
	<div>
		<SettingsComponent />
		<UserSystemComponent />
		<UserNotifications />
	</div>
</template>
