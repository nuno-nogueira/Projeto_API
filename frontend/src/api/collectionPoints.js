import api from '@/api/api'

export default {
    allCollectionPoints({route_type}) {
        return api().get("collection-points", {params: {route_type}});
    },

    getCollectionPoint(collectionPointID) {
        return api().get(`collection-points/${collectionPointID}`);
    },

    createCollectionPoint(collectionPointData) {
        return api().post("collection-points/", collectionPointData)
    },

    updateCollectionPoint(collectionPointID,data) {
        return api().put(`collection-points/${collectionPointID}`,data);
    },

    deleteCollectionPoint(collectionPointID) {
        return api().delete(`collection-points/${collectionPointID}`);
    }
}