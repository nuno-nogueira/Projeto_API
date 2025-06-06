import api from '@/api/api'

export default {
    allCollectionGuides() {
        return api().get("collection-guides");
    },

    getCollectionGuide(collectionGuideID) {
        return api().get(`collection-guides/${collectionGuideID}`);
    },

    createCollectionGuide(collectionGuideID) {
        return api().post("collection-guides/", collectionGuideID)
    },

    updateCollectionGuides(collectionGuideID) {
        return api().patch(`collection-guides/${collectionGuideID}`);
    },
}