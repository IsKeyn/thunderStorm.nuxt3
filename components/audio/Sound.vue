<script setup>
// Глобальная переменная для отслеживания воспроизведения
import { onUnmounted, watch } from "vue";

import { useSoundStore } from '@/stores/sound';
const soundStore = useSoundStore();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	userStore,
} = userFunctions();

let isPlaying = false;
let currentAudio = null;

// Функция для воспроизведения звука
const playSoundEffect = () => {
	// Если звук уже играет, не запускаем повторно
	if (isPlaying) {
		console.log('Звук уже воспроизводится, пропускаем запуск');
		return;
	}

	let soundUrl = null;

	if (soundStore.soundObj) {
		soundUrl = soundStore.soundObj.src;
	} else if (soundStore.soundUrl) {
		soundUrl = soundStore.soundUrl;
	}

	if (!soundUrl) {
		console.log('Ссылка отсутствует');
		return;
	}

	try {
		const audio = new Audio(soundUrl);
		currentAudio = audio;

		// Устанавливаем громкость
		setVolume(audio);

		// Устанавливаем флаг воспроизведения
		isPlaying = true;

		// Обработчик окончания воспроизведения
		audio.addEventListener('ended', () => {
			clearData();
		});

		// Обработчик ошибок
		audio.addEventListener('error', () => {
			clearData();
			console.error('Ошибка воспроизведения звука');
		});

		// Запускаем воспроизведение
		audio.play().catch(e => {
			clearData();
			console.error('Ошибка запуска звука:', e);
		});

	} catch (error) {
		clearData();
		console.error('Ошибка создания аудио:', error);
	}
};

const clearData = () => {
	isPlaying = false;
	soundStore.playSound = false;
	currentAudio = null;
	soundStore.soundUrl = '';
	soundStore.soundObj = null;
}

const setVolume = (audioElement) => {
	if (isAuth && userStore.user?.settings?.soundVolume !== undefined) {
		const volume = userStore.user.settings.soundVolume;
		if (typeof volume === 'number' && !isNaN(volume) && isFinite(volume)) {
			audioElement.volume = volume ? volume / 100 : 0;
		} else {
			audioElement.volume = 0.2;
		}
	} else {
		audioElement.volume = 0.2;
	}
}

// Функция для остановки звука
const stopSound = () => {
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
	}
	isPlaying = false;
	soundStore.playSound = false;
	currentAudio = null;
};

// Останавливаем звук при размонтировании компонента
onUnmounted(() => {
	stopSound();
});

watch(soundStore, async () => {
	if (soundStore.playSound) {
		playSoundEffect();
	}
});

// Watcher для обновления громкости
watch(() => userStore.user?.settings?.soundVolume, () => {
	if (currentAudio) {
		setVolume(currentAudio);
	}
}, { deep: true });

</script>

<template>
	<div
			v-if="isPlaying && soundStore.soundObj"
			class="sound-player"
	>
		{{ soundStore.soundObj.name }}
	</div>
</template>

<style lang="scss" scoped>
.sound-player {
	@apply absolute top-[2rem] left-[2rem] z-[1];
}
</style>
