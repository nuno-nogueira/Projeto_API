import api from '@/api/api'

export default {
    allCollectionPoints({route_type}) {
        return api().get("collection-points", {params: {route_type}});
    },

    getCollectionPoint(collectionPointID) {
        return api().get(`collection-points/${collectionPointID}`);
    },

    createCollectionPoint(collectionPointID) {
        return api().post("collection-points/", collectionPointID)
    },

    updateCollectionPoints(collectionPointID) {
        return api().patch(`collection-points/${collectionPointID}`);
    },

    deleteCollectionPoints(collectionPointID) {
        return api().delete(`collection-points/${collectionPointID}`);
    }
}