import api from '@/api/api'

export default {
  updateReading(readingID, data) {
    return api().patch(`rfid-readings/${readingID}`, data)
  }
}
