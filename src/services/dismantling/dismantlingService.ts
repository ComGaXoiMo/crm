import { PagedResultDto } from '@services/dto/pagedResultDto'
import http from '@services/httpService'

class DismantlingService {
  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get('api/services/app/DismantlingRequests/GetAll', { params })
    const result = res.data.result

    return result
  }
  public async get(id: number) {
    const res = await http.get('api/services/app/DismantlingRequests/Get', { params: { id } })
    const result = res.data.result
    return result
  }

  public async getDismantlingRequest() {
    const res = await http.get('api/services/app/DismantlingRequests/GetStatus')
    const result = res.data.result
    return result
  }

  public async getCustomerOptions(params) {
    const res = await http.get('api/services/app/Customers/GetAll', {params})
    const result = res.data.result
    return result
  }

  public async createDismantling (body) {
    delete body.datePicker
    const res = await http.post('api/services/app/DismantlingRequests/Create', body)
    const result = res.data.result
    return result
  }

  public async updateDismantling (body) {
    const dismantlingPhotoBefore = new FormData();
    (body.dismantlingPhotoBefore || []).filter(item => !item.id).forEach((file) => {const blobFile = new Blob([file]);dismantlingPhotoBefore.append('dismantlingPhotoBefore', blobFile, file.name)})
    const dismantlingPhotoAfter = new FormData();
    (body.dismantlingPhotoAfter || []).filter(item => !item.id).forEach((file) => {const blobFile = new Blob([file]);dismantlingPhotoAfter.append('dismantlingPhotoAfter', blobFile, file.name)})
    
    delete body.dismantlingPhotoBefore
    delete body.dismantlingPhotoAfter
    delete body.datePicker
    const res = await http.put('api/services/app/DismantlingRequests/Update', body)
    const uniqueId = res.data.result.uniqueId
    
    if (dismantlingPhotoBefore.getAll('dismantlingPhotoBefore').length) {
      await http.post(`/api/Documents/UploadBeforeDismantles`, dismantlingPhotoBefore, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        params: { uniqueId }
      })
    }
    if (dismantlingPhotoAfter.getAll('dismantlingPhotoAfter').length) {
      await http.post(`/api/Documents/UploadAfterDismantles`, dismantlingPhotoBefore, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        params: { uniqueId }
      })
    }
    const result = res.data.result
    return result
  }
  public async getDocument(uniqueId) {
    const res = await http.get('/api/services/app/Documents/GetDocuments', {params: {uniqueId}})
    const result = res.data.result
    return result
  }

  public async deactivate(id) {
    await http.delete('api/services/app/DismantlingRequests/Delete', {params: {id}})
  }
}

export default new DismantlingService()
