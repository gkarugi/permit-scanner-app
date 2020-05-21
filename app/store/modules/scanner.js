import Vue from 'nativescript-vue'
import * as schema from '../schema'
import { normalize } from 'normalizr'

export default {
    state: {
        entities: {
            occupants: {},
            permits: {},
            scans: {},
            vehicles: {}
        },
        scans: []
    },

    getters: {
        getScans: state => {
          return state.scans;
        }
      },

    actions: {
        updateEntity({ commit }, { entityData }) {
            const entity = entityData

            // Normalizing allows us to break down the response into separate 'entities'
            const normalizedEntity = normalize(entity, schema.scan)

            commit("updateEntityTypes", { entities: normalizedEntity.entities })
        },

        fetchScanHistory({commit},data) {
            // const normalizedEntity = normalize(data, schema.scansArray)
            // commit("updateEntityTypes", { entities: normalizedEntity.entities })
            commit("updateData", data)
        }
    },

    mutations: {
        ["updateEntityTypes"](state, { entities }) {
            // Loop over all kinds of entities we received
            for (let type in entities) {
                for (let entity in entities[type]) {
                    const oldObj = state.entities[type][entity] || {}
                    // Merge the new data in the old object
                    const newObj = Object.assign(oldObj, entities[type][entity])
                    // Make sure new entities are also reactive
                    Vue.set(state.entities[type], entity, newObj)
                    //
                }
            }
        },

        updateData : (state, data) => {
            if(Array.isArray(data) === false) {
                state.scans = [...state.scans, data]
            } else {
                Vue.set(state,'scans',[...data]);
            }
        }
    },
}