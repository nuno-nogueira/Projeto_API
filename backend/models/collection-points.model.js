//placeholder for now
let collection_points = [
    {
        id: 1,
        point_type: "residential",
        geographical_coordinates: "39-40-33, 8-08-38",
        schedule: "11h00-20h00",
        address: "Rua 1",
        postal_code: "1234-567",
        door_number: 1,
        route: 1,
        residual_type: ["paper","plastic"]
    },
    {
        id: 2,
        point_type: "street",
        geographical_coordinates: "39-40-33, 8-08-38",
        schedule: "11h00-20h00",
        address: "Rua 2",
        postal_code: "1234-567",
        door_number: 2,
        route: 2,
        residual_type: ["paper","glass"]
    },
    {
        id: 3,
        point_type: "residential",
        geographical_coordinates: "39-40-33, 8-08-38",
        schedule: "11h00-20h00",
        address: "Rua 3",
        postal_code: "1234-567",
        door_number: 3,
        route: 2,
        residual_type: ["glass","plastic"]
    }
]

// Data will go here
module.exports = collection_points