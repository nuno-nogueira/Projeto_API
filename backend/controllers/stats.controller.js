// Import the collection points data model to calculate the statistics
const collection_points = require("../models/collection-points.model.js");

let calculateStatsByResidualType = (req, res) => {
    // Find the residual type with the given id
    /**COLOCAR A ACCESS TOKEN */
    const residual_by_type = collection_points.filter(point => point.residual_type.includes(req.params.residualType));

    // 404 Error - If residual type couldnt be found
    if (!residual_by_type) {
        return res.status(404).json({errorMessage: "Residual Type not found"})
    }

    /**COLOCAR ERRO 401 (UNAUTHORIZED) */

    /**CALCULAR PESO POR TIPO DE RESIDUO (??) */

    res.json(residual_by_type)
}

module.exports = {
    calculateStatsByResidualType
}