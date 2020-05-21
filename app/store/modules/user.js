import * as ApplicationSettings from "application-settings"

export default {
    state: {
        token: false,
    },  

    getters: {
        token: state => {
            return state.token
        }
    },

    mutations: {
        setUser(state, token) {
            state.token = token
        },

        clearUser(state) {
            state.token = false
        }
    },

    actions: {
        setUser({ commit }, token) {
            commit('setUser', token)
            ApplicationSettings.setString("token", JSON.stringify(token))
        },

        loadFromStorage(state) {
            // Handle token expiry time here
            const storedState = ApplicationSettings.getString("token")

            if (storedState) {
                const token = JSON.parse(storedState)
                state.token = token
            }
        },

        clearUser({ commit }) {
            commit('clearUser');
            ApplicationSettings.remove("token");
        }
    }
}