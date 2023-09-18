export class RegistreGrid {

    /**
     * Initialise la grille
     * 
     * @param {object} options 
     * - columnWidth {number} La largeur de chaque colonne
     * - rowHeight {number} Hauteur de chaque ligne
     * - firstColumnWidth {number} La largeur de la première colonne
     * - secondColumnWidth{number} La largeur de la deuxième colonne
     * - dateStart {string} La date de début de la période YYYY-MM-DD
     * - dateEnd {string} La date de fin de la période YYYY-MM-DD
     * - rows {number} Le nombre de lignes dans le tableau, hors ligne d'en-tête
     * - cols {number} Le nombre de colonnes dans le tableau, hors ligne d'en-tête
     */
    constructor(options) {
        this.columnWidth = options.columnWidth;
        this.rowHeight = options.rowHeight;
        this.firstColumnWidth = options.firstColumnWidth;
        this.firstColumnHeight = options.firstColumnHeight;
        this.secondColumnWidth = options.secondColumnWidth;
        this.dateStart = options.dateStart;
        this.dateEnd = options.dateEnd;
        this.rows = options.rows;
        this.cols = options.cols;
    }

    /**
     * Retourne la position depuis le haut en fonction du numéro de la ligne
     * 
     * @param {number} n        Le numéro de la ligne
     * @param {string} sx       Suffixe à ajouter à l'unité (ex : px)
     * @param {number} coef     Un coeficient multiplicateur pour tracer la grille (défaut 1)
     * 
     * @return {string}
     */
    getTopPosition(n, sx, coef) {
        coef = typeof coef === "undefined" ? 1 : coef;
        const top = (n-1) * (this.columnWidth * coef);
        return sx ? `${top}${sx}` : top;
    }

    /**
     * Retourne la position de la colonne depuis la gauche en fonction du numéro de la colonne
     * 
     * @param {number} n        Le numéro de la colonne
     * @param {number} coef     Un coeficient multiplicateur pour tracer la grille (défaut 1)
     * @param {string} sx       Suffixe à ajouter à l'unité (ex : px)
     * 
     * @return {string}
     */
    getLeftPosition(n, sx, coef) {
        coef = typeof coef === "undefined" ? 1 : coef;
        const left = ((n-1) * (this.columnWidth * coef)) + this.firstColumnWidth + this.secondColumnWidth;
        return sx ? `${left}${sx}` : left;
    }

    /**
     * Retourne la largeur d'un élément en fonction du nombre de colonnes à occuper
     * 
     * @param {number} cols Nombre de la colonne
     * @param {string} sx   Le suffixe à ajouter (ex px)
     * 
     * @return {number|string}
     */
    getWidth(cols, sx) {
        const width = cols * this.columnWidth;
        return typeof sx !== 'undefined' ? `${width}${sx}` : width;
    }

    /**
     * Retourne la largeur complète de la grille
     * 
     * @param {string} sx           Suffixe à ajouter (ex : px)
     * 
     * @return {string|number}
     */
    getTableWidth(sx) {
        const width = (this.cols * this.columnWidth) + this.firstColumnWidth + this.secondColumnWidth;
        return sx ? `${width}px` : width;
    }

    /**
     * Retourne la hauteur complète de la grille, incluant la ligne d'entête
     * 
     * @param {string} sx           Suffixe à ajouter (ex : px)
     * 
     * @return {string|number}
     */
    getTableHeight(sx) {
        const height = (this.rows) * this.firstColumnHeight + this.rowHeight;

        return sx ? `${height}px` : height;
    }
}