const debounce = (callback, time = 250, _timeoutID) =>
  /* eslint-disable-next-line standard/no-callback-literal */
  (...args) => { clearTimeout(_timeoutID, _timeoutID = setTimeout(() => { callback(...args) }, time)) }

const isObject = val =>
  val !== null && typeof val === 'object' && !Array.isArray(val)

const objFromEntries = objEntriesArray =>
  objEntriesArray.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})

const recursiveObjPatch = (masterObj, patchObj = {}, patchCallback, _nestedKey = '') =>
  objFromEntries(Object.entries(masterObj)
    .map(([key, masterVal]) => [key, (() => {
      if (isObject(masterObj[key])) {
        return recursiveObjPatch(masterObj[key], patchObj[key], patchCallback, `${_nestedKey}${_nestedKey ? '.' : ''}${key}`)
      }

      if (patchObj[key] === undefined) {
        if (patchCallback) return patchCallback(`${_nestedKey}${_nestedKey ? '.' : ''}${key}`, masterVal)
        return masterVal
      }

      return patchObj[key]
    })()]))

export { debounce, recursiveObjPatch }
