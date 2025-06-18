const cron = require('node-cron');
const db = require('../models/db');

const Collection_Guide = db.Collection_Guide;
const Waste_Type = db.Waste_Type;
const Route = db.Route;

// It runs every 2 minutes
cron.schedule('0 */12 * * *', async () => {
    try {
        // Get the current time & format it
        const current_time = new Date();
        const pad = n => n.toString().padStart(2, '0');

        const year = current_time.getFullYear();
        const month = pad(current_time.getMonth() + 1);
        const day = pad(current_time.getDate());
        const weekday = current_time.getDay();

        const hours = pad(current_time.getHours());
        const minutes = pad(current_time.getMinutes());
        const seconds = pad(current_time.getSeconds());

        const issue_date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; 

        // Get the number of collection guides, waste_types & routes
        const count_all_collection_guides = await Collection_Guide.count({});
        const count_all_routes = await Route.count({})

        const collection_guide_id = count_all_collection_guides + 1;
        const route_id =  Math.floor(Math.random() * count_all_routes) + 1;

        // Get the waste ID based on the weekday it is (based on the collection plan)
        let waste_id;

        if (weekday === 1) {
            waste_id = Math.random() < 0.5 ? 1 : 5;
        } else if (weekday === 2) {
            waste_id = Math.random() < 0.5 ? 2 : 4;
        } else if (weekday === 3) {
            waste_id = 3
        } else if (weekday === 4) {
            waste_id = 5
        } else if (weekday === 5) {
            waste_id = 4
        } 

        if (!waste_id) {
            console.log('📛 [CRON] Hoje não é dia de recolha. Guia não criada.');
            return;
        }

        // INSERT Query
        await Collection_Guide.create({
            collection_guide_id,
            issue_date,
            waste_id,
            collection_status: 'não iniciada',
            route_id
        }) 

        console.log('✅ [CRON] Guia criada às', issue_date);
    } catch (err) {
        console.error('❌ [CRON] Erro ao criar guia automaticamente:', err.message);
    }
});