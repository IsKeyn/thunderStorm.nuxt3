<template>
	<div>
		<button @click="requestPermission">Запросить разрешение</button>
		<button @click="showNotification">Показать уведомление</button>
	</div>
</template>

<script setup>
// Запрос разрешения на уведомления
const requestPermission = async () => {
	if ('Notification' in window) {
		const permission = await Notification.requestPermission()

		if (permission === 'granted') {
			console.log('Разрешение получено')
		} else {
			console.log('Разрешение отклонено')
		}
	}
}

// Показать уведомление
const showNotification = () => {
	if ('Notification' in window && Notification.permission === 'granted') {
		new Notification('Заголовок уведомления', {
			body: 'Текст уведомления',
			icon: '/icon.png',
			badge: '/badge.png',
			tag: 'unique-tag',
			requireInteraction: true
		})
	}
}
</script>
