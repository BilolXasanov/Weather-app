<script>
import MainContent from '@/components/MainContent.vue';
import MainWeek from '@/components/MainWeek.vue';

    export default {
        components: {
            MainContent,
            MainWeek
        }
    }
</script>

<template>
    <main class="main container">
        <MainContent/>
        <MainWeek/>
    </main>
</template>

<style scoped lang="scss">

</style>
