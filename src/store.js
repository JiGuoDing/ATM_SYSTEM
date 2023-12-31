// store.js
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            currentUser: null,
        };
    },
    mutations: {
        setCurrentUser(state, user) {
            state.currentUser = user
        },

        setCurrentUserBalance(state, balance) {
            state.currentUser.balance = balance
        },

        setCurrentUserDayLimit(state, DayLimit) {
            state.currentUser.day_limit = DayLimit
        },

        setCurrentUserPsd(state, Password) {
            state.currentUser.password = Password
        }
    },
    actions: {
        login({ commit }, user) {
            // 处理登录逻辑，并将登录的用户信息存储到 state.currentUser
            commit('setCurrentUser', user)
        },

        refreshBalance({ commit }, balance) {
            // 余额刷新后将新余额存入state.currentUser中
            commit('setCurrentUserBalance', balance)
        },

        refreshDayLimit({ commit }, DayLimit) {
            commit('setCurrentUserDayLimit', DayLimit)
        },

        updatePsd({ commit }, Password) {
            commit('setCurrentUserPsd', Password)
        }
    },
});

export default store;
