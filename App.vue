<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    width: 100%;
    height: 100%;
    background-image: url('src/assets/bkgd1.jpg');
    background-size: cover;
}
</style>