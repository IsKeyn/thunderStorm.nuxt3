<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const spaceForGame = ref(null)
const intervalId = ref(null)
const keyElement = ref(null)

const randomSquare = () => {
	if (!spaceForGame.value) return

	// Очищаем предыдущие элементы
	spaceForGame.value.innerHTML = ''

	const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
	const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	const size = Math.floor(width / 17) - 2
	const count = Math.floor(height / size) * 17 + 17
	// const paddingLeft = (width - 17 * (size + 2)) / 2
	const min = 1
	const max = count
	const key = Math.floor(Math.random() * (max - min) + min)

	// Устанавливаем стили
	// spaceForGame.value.style.paddingLeft = `${paddingLeft}px`

	// Создаем элементы
	for (let i = 1; i < count + 1; i++) {
		const box = document.createElement('div')
		box.className = `square bit${i}`
		box.style.width = `${size}px`
		box.style.height = `${size}px`

		if (i === key) {
			keyElement.value = box
			box.addEventListener('click', handleWin)
		}

		spaceForGame.value.appendChild(box);
	}

	// Добавляем очистку
	const clearDiv = document.createElement('div')
	clearDiv.className = 'clear'
	spaceForGame.value.appendChild(clearDiv)

	// Устанавливаем верхний отступ
	// const paddingTop = (height - ((count / 17) * (size + 2))) / 2
	// spaceForGame.value.style.paddingTop = `${paddingTop}px`

	// Запускаем анимацию
	intervalId.value = setInterval(() => {
		const rand = Math.floor(Math.random() * (max - min) + min)
		const randElement = spaceForGame.value.querySelector(`.bit${rand}`)
		const animateClassName = 'animate'

		if (randElement && randElement.classList.contains(animateClassName)) {
			randElement.classList.remove(animateClassName)
		} else if (randElement) {
			randElement.classList.add(animateClassName)
		}
	}, 300)

	console.log(`Ок, ты что-то знаешь... Супер-приз в контейнере ${key}`)
}

const handleWin = () => {
	// Здесь можно реализовать модальное окно
	alert('Ты угадал, молодец!')
	// Или использовать композицию для модального окна:
	// modalStore.showModal('wind_box', 'Ты угадал, молодец!', { size: 'small' })
}

const cleanup = () => {
	if (intervalId.value) {
		clearInterval(intervalId.value)
	}
	if (keyElement.value) {
		keyElement.value.removeEventListener('click', handleWin)
	}
}

onMounted(() => {
	randomSquare();
})

onUnmounted(() => {
	cleanup()
})

// Для совместимости с deffered
if (typeof window !== 'undefined' && window.deffered) {
	window.deffered.games.resolve()
}
</script>

<template>
	<div class="game-container">
		<div ref="spaceForGame" class="js_space_for_game"></div>
	</div>
</template>

<style lang="scss">
.game-container {
	width: 100%;
	height: 100vh;
}

.js_space_for_game {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.square {
	margin: 1px;
	background-color: #5eeaa3;
	transition: all 0.3s ease;
}

.square.animate {
	background-color: #d02e2e;
}

.clear {
	clear: both;
}
</style>
