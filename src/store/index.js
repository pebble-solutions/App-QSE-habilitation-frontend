import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		elements: [],
		types: [],
		habilitationType: [],
		habilitationsPersonnels: [],
		suspensions: [
			{
				"id": 2,
				"habilitation_id": 11,
				"commentaire": null,
				"dd": "2023-12-01 12:00:00",
				"df": null
			},
			{
				"id": 1,
				"habilitation_id": 13,
				"commentaire": null,
				"dd": "2023-12-01 12:00:00",
				"df": null
			},
			{
				"id": 3,
				"habilitation_id": 608,
				"commentaire": null,
				"dd": "2023-07-01 12:00:00",
				"df": null
			},
			{
				"id": 4,
				"habilitation_id": 522,
				"commentaire": null,
				"dd": "2023-12-01 12:00:00",
				"df": null
			},
			{
				"id": 5,
				"habilitation_id":  453,
				"commentaire": null,
				"dd": "2022-12-01 12:00:00",
				"df": "2023-02-01 12:00:00"
			},
			{
				"id": 6,
				"habilitation_id": 41,
				"commentaire": null,
				"dd": "2023-12-01 12:00:00",
				"df": null
			},
			{
				"id": 7,
				"habilitation_id": 611,
				"commentaire": null,
				"dd": "2023-06-01 12:00:00",
				"df": null
			}
		],
		veilles: [],
		formulaires: [],
		personnels: [],
		habilitations: [],
		habilitationsTypes: [],
		echeancier: null,
		personnelsFiltered: [],
		pending: {
			habilitationsPersonnels: false,
			personnelsFiltered: true,
		},



	},
	getters: {
		activeStructure(state) {
			return state.structures.find(e => e.id === state.activeStructureId);
		}
	},
	mutations: {
		/**
		 * Enregistre le login dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} login L'objet Login
		 */
		setLogin(state, login) {
			state.login = login;
		},

		/**
		 * Enregistre les structures chargées dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} structures La liste des structures
		 */
		setStructures(state, structures) {
			state.structures = structures;
		},

		/**
		 * Enregistre la structure active dans le store
		 * @param {Object} state Le state de vueX
		 * @param {Integer} structureId L'id de la structure à activer
		 */
		setStructureId(state, structureId) {
			state.activeStructureId = structureId;
		},

		/**
		 * Enregistre l'echeance dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} echeancier L'objet Login
		 */
		setEcheance(state, echeancier) {
			state.echeancier = echeancier
		},

		/**
		 * Enregistre les types d'habilitations
		 * @param	{Object}	state le state de VueX
		 * @param	{Array}		habilitations	Liste des type d'habilitations
		 */
		setHabilitationType(state, habilitationType) {
			state.habilitationType = habilitationType;
		},

		/**
		 * enregistre la liste des formulaires
		 * @param	{Object}	state le state de vueX
		 * @param	{Array}		formulaires	liste des fomulaires
		 */
		setFormulaires(state, formulaires) {
			state.formulaires = formulaires
		}
	},
	actions: {
		/**
		 * Enregistre l'ouverture d'une session
		 * @param {Object} context L'instance vueX
		 * @param {Object} payload Un objet contenant une clé login et une clé structure
		 */
		login(context, payload) {
			context.commit('setLogin', payload.login);
			context.commit('setStructures', payload.structures);
		},

		/**
		 * Enregistre la fermeture d'une session
		 * @param {Object} context L'instance vueX
		 */
		logout(context) {
			context.commit('setLogin', null);
			context.commit('setStructures', []);
		},

		/**
		 * Bascule sur une structure
		 * @param {Object} context L'instance vueX
		 * @param {Integer} payload L'ID de la structure active
		 */
		switchStructure(context, payload) {
			context.commit('setStructureId', payload);
		},
		/**
		 * met à jour la liste des types d'habilitation
		 * @param {Object} context l'instance de VueX
		 * @param {Array} data liste des types d'habilitations
		 */
		refreshHabilitationType(context, data) {
			context.commit('setHabilitationType', data);
		},
		/**
		 * charge dans le store une requete de stat 
		 * @param {Object} context 
		 * @param {Object} data 
		 */
		setEcheance(context, data) {
			context.commit('setEcheance', data)
		},
		/**
		 * met à jour la liste des formulaires
		 * @param {Object} context 
		 * @param {Array} data 
		 */
		refreshFormulaires(context, data) {
			context.commit('setFormulaires', data);
		},
	},
	modules: {
	}
})
