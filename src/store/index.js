import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		elements: [],
		types: [],
		openedElement: null,
		habilitationType: [],
		habilitationsPersonnels: [],
		suspensions:[],
		veilles: [],
		personnels: [],
		habilitations: [],
		habilitationsTypes: [],
		echeancier: [],



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
			console.log(echeancier, 'toto')
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
		 * Renseigne l'élément actif
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Integer} element L'élément à charger
		 */
		openedElement(state, element) {
			state.openedElement = element;
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
	},
	modules: {
	}
})
