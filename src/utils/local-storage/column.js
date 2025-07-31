export const saveToLocalStorageSheet = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  export const loadFromLocalStorageSheet = (key, defaultValue) => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  }

  export const loadTabsFromLocalStr = (key) => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : ''
  }
  