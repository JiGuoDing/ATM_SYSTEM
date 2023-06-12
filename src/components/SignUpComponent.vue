<template>
    <div id="signUpBox">
        <div id="signUpHead">
            注册
        </div>
        <div id="signUpBody">
            <input class="input" v-model="userName" type="text" placeholder="请输入用户名" />
            <input class="input" v-model="password" type="password" placeholder="请输入密码" />
        </div>
        <div id="btn"></div>
    </div>
</template>

<script>
export default {
    name: 'SignUpComponent',
    components: {},
}
</script>

<style></style>