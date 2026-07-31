<script setup>
import { ref } from "vue";

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { addTextToPoints } = boardGame();

const props = defineProps({
	storeProfit: {
		type: Number,
		default: 0,
	},
});

const phrase = [
	'Дай угадаю, опять не выгодно?',
	'Раньше меня тоже вела дорога приключений, а потом кот повредил мне колено',
	'Не нравится ассортимент? Радуйся, что я не продаю тухлые бананы',
	'Кому я сегодня положил свой сыр!?',
	'Мои товары лучшие на всем ивенте!',
	'Раньше я не открывал свой магазин, боялся, что натыкают ножей в спину',
	'Купи бомбу, кинь в лидера',
	'Когда админ спит, я подкручиваю рулетку',
	'Жизнь торговца не проста, приходится слушать анекдоты про двух бомжей',
	'Зачем мне очки? Купить бомб и кинуть в тебя, чтобы не задавал таких вопросов',
	'А ты знал, что нестабильная бомба может взорваться при покупке?',
	'Хочу открыть черный рынок и продавать предметы с предыдущих ивента, псс, не хочешь не много говновоза?',
	'Никто не знает, но я не только подкладываю сыр, но также забираю излишки очков',
	'Скидка? Какое-то матерное слово',
	'Судя по твоему инвентарю, ты тоже играл в рулетку. Только в отличие от меня, проиграл',
	'На сколько мне сегодня поднять цены? На 100 или на 200 очков?',
	'Очки не пахнут. А вот ты пахнешь, тебе выпал тухлый банан из рулетки или говновоз?',
	'Приходи еще! Мне нужно на ком-то отыграться за то, что админ опять урезал мой процент',
	'О, клиент! Надеюсь, сегодня ты пришёл с очками, а не с надеждой',
	'Если долго смотреть на цены, они сами ниже не станут',
	'Смотри сколько хочешь. Смотреть пока бесплатно',
	'У меня нет плохих товаров. Есть бедные покупатели',
	'Каждый раз, когда кто-то ничего не покупает, я поднимаю цены. Совпадение?',
	'Даже не спрашивай про скидку. Мне смешно уже заранее',
	'Вижу по глазам — денег нет, но посмотреть очень хочется',
	'Не волнуйся, ты не самый странный клиент. Вчера приходил админ',
	'У тебя такой взгляд, будто опять не повезло с рулеткой',
	'Я бы посоветовал тебе выгодную покупку... но мне это невыгодно',
	'Если ничего не купишь, хотя бы дверь за собой закрой. Сквозняк тоже денег стоит',
	'Возвращайся почаще. Мне нравится наблюдать, как исчезают твои очки',
	'Иногда я сам покупаю у себя товары. Чтобы поддерживать экономику',
	'Если товар взорвётся — это особенность, а не брак',
	'Не смотри ты так на бомбы. Они тоже начинают нервничать',
	'Пока ты выбираешь, кто-то другой уже переплачивает',
	'Улыбнись. Всё равно платить придётся',
	'У меня отличная память. Всех, кто просил скидку, я уже занёс в чёрный список',
	'Если найдёшь дешевле — значит, меня там ещё не было',
	'Некоторые копят очки месяцами. Ты же тратишь их за пять минут. Уважаю',
	'Главное правило торговли: если клиент улыбается после покупки — значит, цена была слишком низкой',
	'Я продаю счастье. Просто оно почему-то стоит очень дорого',
	'Не задерживай очередь. Даже если её нет, она могла бы быть',
	'Хочешь гарантию? Гарантирую, что очки назад не вернутся',
	'Кажется, ты снова пришёл финансировать мой отпуск',
];

const randomPhrase = ref(null);
const changePhraseInterval = ref(null);

const setRandomPhrase = () => {
	if (phrase.length <= 1) {
		randomPhrase.value = phrase[0] || "";
		return;
	}

	const currentIndex = phrase.indexOf(randomPhrase.value);
	let newIndex;

	do {
		newIndex = Math.floor(Math.random() * phrase.length);
	} while (newIndex === currentIndex && currentIndex !== -1);

	randomPhrase.value = phrase[newIndex];

	if (changePhraseInterval.value) {
		clearInterval(changePhraseInterval.value)
	}

	changePhraseInterval.value = setInterval(() => {
		setRandomPhrase();
	}, 30000)
};

setRandomPhrase();

const titleImage = {
	src: '/images/board-games/shop/Ksirsik.png',
	name: 'Ксырстык',
};
</script>

<template>
	<div class="image-box">
		<img src="/images/board-games/shop/Ksirsik.png" class="article-image">
		<div
				class="quote-box"
				@click="setRandomPhrase"
		>
			<Transition name="fade" mode="out-in">
					<span :key="randomPhrase">
						{{ randomPhrase }}
					</span>
			</Transition>
		</div>
		<div class="store-profit">
			Владелец магазина заработал {{ addTextToPoints(storeProfit) }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.image-box {
	@apply
		relative
		flex justify-center items-center
		h-[450px]
		overflow-hidden
	;

	.article-image {
		@apply w-full h-full object-cover object-top;

		object-position: 50% -135px;

		@media (max-width: 1024px) {
			object-position: 100% -10px;
		}
	}

	.quote-box {
		@apply
			absolute
			top-[10px] md:top-[30%] lg:top-1/2 lg:-translate-y-1/2 left-0 lg:left-1/4 lg:-translate-x-1/2
			bg-[var(--body-bg-color)] text-[var(--main-dark-text-color)] p-[1rem] text-[2rem]
			max-w-full lg:max-w-[45%] cursor-pointer
			text-wrap
			break-words
			opacity-80
		;
	}

	.store-profit {
		@apply
			absolute bottom-[1rem] lg:right-[1rem]
			bg-[var(--body-bg-color)] text-[var(--main-dark-text-color)] p-[1rem] text-[1rem]
			max-w-full lg:max-w-[45%] cursor-pointer
			text-wrap
			break-words
		;
	}
}
</style>
