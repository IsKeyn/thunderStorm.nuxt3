<script setup>
import Settings from '@/modules/boardGame/components/user/player/profileElement/premiumFragments/Settings.vue';

const emit = defineEmits(['refresh']);

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	userName: {
		type: String,
		default: null,
	},
});

</script>

<template>
	<template v-if="!element.premium">
		<div class="item-box">
			Мы являемся не коммерческим проектов. В данный момент у нас нет ни рекламы, ни спонсоров ни кокого-либо иного материального дохода от проекта.<br />
			<br />
			Весь проект держится на энтузиазме.<br />
			<br />
			Но сам проект материально зависит, так как требует оплаты сервера, домена, ресурсов использумых для разработки и хранения данных.<br />
			Если у Вас есть желание и возможность поддержать проект материально, воспользуйтесь ссылкой на донат.<br />
			В благодарность пользователям, которые поддержали проект на сумму 300 рублей или больше мы выдаем премиум доступ, в рамках текущего ивета.<br />
			<br />
			Премиум доступ дает следующие возможности:
			<ul>
				<li>Установка анимированной рамки аватара, с возможностью выбора цвета анимации</li>
				<li>Смена фонового изображения профайла</li>
				<li>Установка статус сообщения, которые могут увидеть другие участники</li>
				<li>Возможность добавить свои игры в ивент, до выполнения условий необходимых для добавления игр</li>
			</ul>
			<br />
			Премиум доступ действует до окончания текущего ивента.
		</div>
		<nuxt-link target="_blank" to="https://www.donationalerts.com/r/keyntr" class="btn btn-simple">Ссылка на донат</nuxt-link>
	</template>
	<Settings
			v-else
			:element="element"
			@refresh="$emit('refresh')"
	/>
</template>

<style lang="scss" scoped>
.item-box {
	@apply rounded-none block;
}
</style>
