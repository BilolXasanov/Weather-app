// dt — UTC bo'yicha kun o'rtasi (soniyalarda), shuning uchun timeZone: 'UTC'
export function unix(dt, type) {
    const date = new Date(dt * 1000)
    const opts = { timeZone: 'UTC' }

    if (type === 'weekday') {
        const day = date.toLocaleDateString('ru-RU', { ...opts, weekday: 'long' })
        return day.charAt(0).toUpperCase() + day.slice(1)
    }
    if (type === 'day') {
        return date.toLocaleDateString('ru-RU', { ...opts, day: 'numeric' })
    }
    if (type === 'month') {
        // "16 октября" ko'rinishidagi (kelishik shaklidagi) oy nomini olamiz
        const parts = new Intl.DateTimeFormat('ru-RU', { ...opts, day: 'numeric', month: 'long' }).formatToParts(date)
        return parts.find((p) => p.type === 'month').value
    }
    return ''
}
