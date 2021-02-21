export const store = {
  get(key = 'default') {
    try {
      const store = localStorage.getItem(key)
      const result = JSON.parse(store)

      if(typeof result == 'object' && Array.isArray(result))
        return result

      return []
    }catch(e) {
      return []
    }
  },
  set(key = 'default', data = []) {
    const obj = JSON.stringify(data)
    localStorage.setItem(key, obj)
  }
}