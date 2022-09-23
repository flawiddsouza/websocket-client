import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

export function formatTimestamp(epoch: number) {
    return dayjs(epoch).format('YYYY-MM-DD hh:mm:ss A')
}

export function generateId() {
    return nanoid()
}

export function getObjectPaths(object: any) {
    let paths: string[] = []

    function recurse(obj: any, keyParent='') {
        if(typeof obj === 'number' || typeof obj === 'string') {
            return
        }
        const isArray = Array.isArray(obj)
        Object.keys(obj).forEach(key => {
            let newKeyParent = keyParent
            if(newKeyParent) {
                if(isArray) {
                    newKeyParent = `${newKeyParent}[${key}]`
                } else {
                    newKeyParent = `${newKeyParent}.${key}`
                }
            } else {
                newKeyParent = key
            }
            paths.push(newKeyParent)
            recurse(obj[key], newKeyParent)
        })
    }

    recurse(object)

    return paths
}
