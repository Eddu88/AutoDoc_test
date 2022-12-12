
/**
 * It takes a key name, a key value, and a time to live (in seconds) as arguments, and stores the key
 * value in LocalStorage with the key name, and a timestamp that is the current time plus the time to
 * live.
 * @param keyName - the name of the key you want to store
 * @param keyValue - The value you want to store in LocalStorage
 * @param ttl - The time to live in seconds.
 */
const setStorage = (keyName, keyValue, ttl) => {
    const data = {
        value: keyValue,                  // store the value within this object
        ttl: Date.now() + (ttl * 1000),   // store the TTL (time to live)
    }

    // store data in LocalStorage 
    localStorage.setItem(keyName, JSON.stringify(data));
};

/**
 * If the key exists in localStorage, and the TTL has not expired, return the value associated with the
 * key. Otherwise, return null
 * @param keyName - The name of the key you want to store the data under.
 * @returns The value of the keyName if it exists and has not expired.
 */
const getStorage = (keyName) => {
    const data = localStorage.getItem(keyName);
    if (!data) {     // if no value exists associated with the key, return null
        return null;
    }

    const item = JSON.parse(data);

    // If TTL has expired, remove the item from localStorage and return null
    if (Date.now() > item.ttl) {
        localStorage.removeItem(key);
        return null;
    }

    // return data if not expired
    return item.value;
};

export { setStorage, getStorage };