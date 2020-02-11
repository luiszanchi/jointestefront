<template>
    <div>
        <NavBar> </NavBar>
        <div style="height: 50px; width: 100%;"></div>
        <router-view></router-view>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
    name: 'Template',
    components: {
        NavBar
    }
}
</script>

<style lang="stylus">
.full-width {
    width: 100% !important;
}
</style>