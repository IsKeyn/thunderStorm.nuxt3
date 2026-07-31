<script setup>
</script>

<template>
	<slot />
</template>

<style lang="scss">
/* Основные стили сайта */
@import url('~/assets/scss/style.scss');

/* Стили темы, используемой на сайту */
@import url('~/assets/scss/InSilentHill/vars.scss');
@import url('~/assets/scss/InSilentHill/style.scss');
@import url('~/assets/scss/InSilentHill/fonts.scss');
@import url('~/assets/scss/InSilentHill/imports.scss');

/* Стили тем оформления, доступных для выбора */
@import url('~/assets/scss/Dashboard/style.scss');
@import url('~/assets/scss/Dashboard/themes/Green.scss');
@import url('~/assets/scss/Dashboard/themes/Ocean.scss');
@import url('~/assets/scss/Dashboard/themes/Street.scss');
@import url('~/assets/scss/Dashboard/themes/StreetLight.scss');
@import url('~/assets/scss/Dashboard/themes/WinterLight.scss');
@import url('~/assets/scss/Dashboard/themes/Autumn.scss');
</style>

<style lang="scss">
/* Глобальные стили (без scoped) */
html, body {
	background-color: transparent;
}
</style>
