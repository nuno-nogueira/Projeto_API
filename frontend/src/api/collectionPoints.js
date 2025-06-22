import api from '@/api/api'

export default {
    allCollectionPoints({page = 1, limit = 6, order, route_type}) {
        return api().get("collection-points", {params: {page, limit, order, route_type}});
    },

    getCollectionPoint(collectionPointID) {
        return api().get(`collection-points/${collectionPointID}`);
    },

    createCollectionPoint(collectionPointData) {
        return api().post("collection-points/", collectionPointData)
    },

    updateCollectionPoint(collectionPointID) {
        return api().patch(`collection-points/${collectionPointID}`);
    },

    deleteCollectionPoint(collectionPointID) {
        return api().delete(`collection-points/${collectionPointID}`);
    }
}