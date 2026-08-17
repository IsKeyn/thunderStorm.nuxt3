<script setup>
const {
	burstFromCenter,
	fireworksFromCenter,
	celebration,
	snowfall,
	sideCannons,
	stopCelebration,
	stopSnowfall,
	stopSideCannons,
} = useConfetti()

const stopAll = () => {
	stopCelebration()
	stopSnowfall()
	stopSideCannons()
}
</script>

<div class="page">
<button @click="burstFromCenter()">
	Взрыв из центра
</button>

<button @click="fireworksFromCenter()">
	Фейерверк
</button>

<button @click="celebration()">
	Дождь из конфети (15 сек)
</button>

<button @click="snowfall()">
	Снегопад (15 сек)
</button>

<button @click="sideCannons()">
	Пулемёт из боков (15 сек)
</button>

<button @click="sideCannons(20000, ['#00ff00', '#ffff00'])">
	Зелёно-жёлтый пулемёт (20 сек)
</button>

<button @click="stopAll">
	Остановить всё
</button>
</div>
