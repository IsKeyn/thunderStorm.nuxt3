<script setup>
import UserSystemComponent from '@/components/user/UserSystemComponent.vue';
import SettingsComponent from '@/components/system/SettingsComponent.vue';
import UserNotifications from '@/components/user/notifications/UserNotifications.vue';
import LoadingComponents from '@/components/system/LoadingComponents.vue';
</script>

<template>
	<div>
		<LoadingComponents />
		<SettingsComponent />
		<UserSystemComponent />
		<UserNotifications />
	</div>
</template>
