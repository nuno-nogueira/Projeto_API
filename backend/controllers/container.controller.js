const { Container, Waste_Type } = require('../models');  
const db = require('../models/db.js');
const { ErrorHandler } = require("../utils/error.js"); 

async function getContainer(req, res) {
    try {
        const container = await Container.findByPk(req.params.id, {
            include: [
                { 
                    model: Waste_Type, 
                    as: 'wasteType' 
                }
            ]
        });

    if (!container) return res.status(404).json({ error: 'Container not found' });

    res.json(container);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    getContainer
}
