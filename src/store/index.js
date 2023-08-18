import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		elements: [],
		types: [
			{
				"id": 54,
				"nom": "a modale",
				"dd": null,
				"df": null,
				"expiration": 900
			},
			{
				"id": 64,
				"nom": "derniere",
				"dd": "2023-08-16 00:00:00",
				"df": "2023-08-18 00:00:00",
				"expiration": 2
			},
			{
				"id": 62,
				"nom": "elle est bien?",
				"dd": null,
				"df": null,
				"expiration": 1
			},
			{
				"id": 65,
				"nom": "fqsfqs",
				"dd": "2023-08-17 00:00:00",
				"df": "2023-08-19 00:00:00",
				"expiration": 2
			},
			{
				"id": 21,
				"nom": "Habilitation : ACGEC/ACGER S9A3",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 11,
				"nom": "Habilitation : Autorisation travail en hauteur",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 10,
				"nom": "Habilitation : NF C 18-510_H1V/B1V_BR",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 12,
				"nom": "Habilitation : Risque Amiante opérateur SS4",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 5,
				"nom": "Habilitation : risques électriques C0",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 19,
				"nom": "Habilitation : TES C - RPTx_CCh avec LAM",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 31,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Balises KVB analogiques",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 32,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Balises KVB numériques",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 33,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Balises SILEC",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 40,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Connexions CdV courts sans joint 8700Hz, Jeumont-Schneider ou Alstom",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 39,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Connexions CdV ITE",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 37,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Connexions CdV UM71 et UM71CB",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 38,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Connexions Retour Traction",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 41,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Contacts fixes signaux permanents ou de chantier",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 28,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Détecteur électromécanique Paulvé",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 29,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Détecteur électromécanique Silec Cautor",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 30,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Détecteur électromécanique Silec Forfex",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 36,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Détonateurs",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 26,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Pédales électroniques modèle 75",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 27,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Pédales électroniques modèle 82",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 34,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Signaux permanents",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 35,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - Signaux temporaires",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 18,
				"nom": "Habilitation : TES D - HMT SEG Niveau 1 - UM71CB",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 9,
				"nom": "Habilitation : TES D - HMT SEG Niveau 2",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 24,
				"nom": "Habilitation : TES D - HMT SEG Niveau 2 - Contrôleur d'aiguille conduit Paulvé",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 23,
				"nom": "Habilitation : TES D - HMT SEG Niveau 2 - Contrôleur d'application et de verrouillage de VCC",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 22,
				"nom": "Habilitation : TES D - HMT SEG Niveau 2 - Mécanismes calés de manœuvre électrique d'aiguille",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 25,
				"nom": "Habilitation : TES D - HMT SEG Niveau 2 - Résistances électriques de réchauffage d'aiguilles et VCC",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 13,
				"nom": "Habilitation : TES F - Agent PN en travaux",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 20,
				"nom": "Habilitation : TES G",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 15,
				"nom": "Habilitation : TES H, I, J, K, L - Opérateur Sol (CS2, CS3, CS8 exclues)",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 1,
				"nom": "Habilitation : TES M - Annonceur/Sentinelle",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 3,
				"nom": "Habilitation : TES M - ASP en équipe et autorisé au cumul ASP/Annonceur",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 6,
				"nom": "Habilitation : TES M - ASP seul",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 8,
				"nom": "Habilitation : TSAE - Agent Prestataire 1 LAM ",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 7,
				"nom": "Habilitation : TSAE - Agent prestataire LAM (max 3 LAM)",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 4,
				"nom": "Habilitation : TSAE - Agent prestataire S9",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 2,
				"nom": "Habilitation : TSAE - RSO",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 17,
				"nom": "Habilitation : TSAE - UF Unités Fléxibles",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 16,
				"nom": "Habilitation : TSAE ATTx",
				"dd": null,
				"df": null,
				"expiration": null
			},
			{
				"id": 45,
				"nom": "habilitation test 2",
				"dd": "2023-04-01 00:00:00",
				"df": "2024-05-31 00:00:00",
				"expiration": 900
			},
			{
				"id": 50,
				"nom": "hsfljhjHQ",
				"dd": "2023-04-05 00:00:00",
				"df": "2024-05-30 00:00:00",
				"expiration": 900
			},
			{
				"id": 52,
				"nom": "HSKJQHSKJD",
				"dd": "2023-08-08 00:00:00",
				"df": "2023-08-31 00:00:00",
				"expiration": 900
			},
			{
				"id": 55,
				"nom": "modif",
				"dd": null,
				"df": "2023-08-25 00:00:00",
				"expiration": 100
			},
			{
				"id": 58,
				"nom": "NEW",
				"dd": null,
				"df": null,
				"expiration": 4
			},
			{
				"id": 59,
				"nom": "NEW",
				"dd": null,
				"df": null,
				"expiration": 4
			},
			{
				"id": 60,
				"nom": "une nouvelle ",
				"dd": "2022-01-01 00:00:00",
				"df": "2023-12-31 00:00:00",
				"expiration": 900
			}
		],
		personnels: [],
		suspensions: [],
		habilitations: [],
		openedElement: null
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
		}
	},
	modules: {
	}
})
