import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

export function formatTimestamp(epoch: number) {
    return dayjs(epoch).format('YYYY-MM-DD hh:mm A')
}

export function generateId() {
    return nanoid()
}
