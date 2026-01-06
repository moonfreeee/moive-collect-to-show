// 使用IndexedDB存储大文件
export const dbName = 'movieDisplayDB'
export const videoStoreName = 'videos'
export const imageStoreName = 'images'

// 初始化数据库
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2) // 升级版本号

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains(videoStoreName)) {
        db.createObjectStore(videoStoreName, { keyPath: 'id' })
      }
      
      let imageStore
      if (!db.objectStoreNames.contains(imageStoreName)) {
        imageStore = db.createObjectStore(imageStoreName, { keyPath: 'id' })
        // 创建 workId 索引以便查询
        imageStore.createIndex('workId', 'workId', { unique: false })
      } else {
        // 如果 store 已存在，需要通过 transaction 访问
        imageStore = event.target.transaction.objectStore(imageStoreName)
        // 检查索引是否存在
        if (!imageStore.indexNames.contains('workId')) {
          imageStore.createIndex('workId', 'workId', { unique: false })
        }
      }
    }
  })
}

// 保存视频到IndexedDB
export async function saveVideoToDB(videoId, videoFile) {
  const db = await initDB()
  
  // 先读取文件为ArrayBuffer
  const arrayBuffer = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(videoFile)
  })
  
  // 文件读取完成后再创建事务并保存
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([videoStoreName], 'readwrite')
    const store = transaction.objectStore(videoStoreName)
    
    const request = store.put({
      id: videoId,
      data: arrayBuffer,
      size: videoFile.size,
      type: videoFile.type,
      name: videoFile.name
    })
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    transaction.onerror = () => reject(transaction.error)
  })
}

// 从IndexedDB读取视频
export async function getVideoFromDB(videoId) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([videoStoreName], 'readonly')
    const store = transaction.objectStore(videoStoreName)
    const request = store.get(videoId)
    
    request.onsuccess = () => {
      if (request.result) {
        const blob = new Blob([request.result.data], { type: request.result.type })
        const url = URL.createObjectURL(blob)
        resolve(url)
      } else {
        resolve(null)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

// 删除IndexedDB中的视频
export async function deleteVideoFromDB(videoId) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([videoStoreName], 'readwrite')
    const store = transaction.objectStore(videoStoreName)
    const request = store.delete(videoId)
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// 保存图片到IndexedDB
export async function saveImagesToDB(workId, images) {
  const db = await initDB()
  
  // 将每个图片的 base64 数据转换为 ArrayBuffer
  const imageDataArray = await Promise.all(
    images.map(async (base64Data, index) => {
      // base64 数据格式: data:image/jpeg;base64,/9j/4AAQ...
      const base64 = base64Data.split(',')[1] || base64Data
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return {
        index,
        data: bytes.buffer,
        mimeType: base64Data.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
      }
    })
  )
  
  // 保存所有图片
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([imageStoreName], 'readwrite')
    const store = transaction.objectStore(imageStoreName)
    
    const requests = imageDataArray.map(imgData => {
      return store.put({
        id: `${workId}_${imgData.index}`,
        workId: workId,
        index: imgData.index,
        data: imgData.data,
        mimeType: imgData.mimeType
      })
    })
    
    Promise.all(requests.map(req => 
      new Promise((res, rej) => {
        req.onsuccess = () => res()
        req.onerror = () => rej(req.error)
      })
    )).then(() => resolve())
      .catch(reject)
    
    transaction.onerror = () => reject(transaction.error)
  })
}

// 从IndexedDB读取图片
export async function getImagesFromDB(workId) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([imageStoreName], 'readonly')
    const store = transaction.objectStore(imageStoreName)
    
    // 尝试使用索引，如果不存在则使用全表扫描
    let request
    try {
      const index = store.index('workId')
      request = index.getAll(workId)
    } catch (e) {
      // 如果索引不存在，使用全表扫描
      request = store.openCursor()
      const results = []
      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (cursor.value.workId === workId) {
            results.push(cursor.value)
          }
          cursor.continue()
        } else {
          // 按索引排序
          const sorted = results.sort((a, b) => a.index - b.index)
          const urls = sorted.map(item => {
            const blob = new Blob([item.data], { type: item.mimeType })
            return URL.createObjectURL(blob)
          })
          resolve(urls)
        }
      }
      request.onerror = () => reject(request.error)
      return
    }
    
    request.onsuccess = () => {
      if (request.result && request.result.length > 0) {
        // 按索引排序
        const sorted = request.result.sort((a, b) => a.index - b.index)
        const urls = sorted.map(item => {
          const blob = new Blob([item.data], { type: item.mimeType })
          return URL.createObjectURL(blob)
        })
        resolve(urls)
      } else {
        resolve([])
      }
    }
    request.onerror = () => reject(request.error)
  })
}

// 删除IndexedDB中的图片
export async function deleteImagesFromDB(workId) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([imageStoreName], 'readwrite')
    const store = transaction.objectStore(imageStoreName)
    
    // 尝试使用索引，如果不存在则使用全表扫描
    let request
    try {
      const index = store.index('workId')
      request = index.openCursor(IDBKeyRange.only(workId))
    } catch (e) {
      // 如果索引不存在，使用全表扫描
      request = store.openCursor()
    }
    
    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.workId === workId || !cursor.value.workId) {
          cursor.delete()
        }
        cursor.continue()
      } else {
        resolve()
      }
    }
    request.onerror = () => reject(request.error)
    transaction.onerror = () => reject(transaction.error)
  })
}

