
import api from '@/api/api'

export default {
    getPlan() {
        return api().get("collection-plan");
    },
}