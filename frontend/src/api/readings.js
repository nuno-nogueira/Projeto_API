import api from '@/api/api'

export default {
  getReadingsByWasteType(user_id) {
    return api().get(`readings/${user_id}`);
  },

  updateReading(readingID, data) {
    return api().patch(`rfid-readings/${readingID}`, data)
  }
}
