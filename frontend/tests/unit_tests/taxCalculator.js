
function calcTaxes(readings,month, pricePerKg = 0.0179) {
    if (!readings || !readings.data) return 0;

    const totalWeight = readings.data
        .filter((reading) => {
            const waste_type = reading.container.waste_type.name
                .trim()
                .toLowerCase();
            const readingMonth = reading.reading_date?.substring(5, 7);
            return waste_type === "indiferenciado" && readingMonth === month;
        })
        .reduce((sum, reading) => sum + (reading.weight_collected || 0), 0);

    return (totalWeight * pricePerKg);
}

module.exports = { calcTaxes };