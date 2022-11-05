// Format-MS
// https://github.com/macen648/format-ms

function objectMS(milliseconds) {
    if (typeof milliseconds !== 'number') {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        }
    }

    return {
        days: Math.trunc(milliseconds / 86400000),
        hours: Math.trunc(milliseconds / 3600000) % 24,
        minutes: Math.trunc(milliseconds / 60000) % 60,
        seconds: Math.trunc(milliseconds / 1000) % 60,
        milliseconds: Math.trunc(milliseconds) % 1000,
    }
}

function formatMS(ms) {
    const parsed = objectMS(ms)
    const Formatted = []
    if (Math.trunc(parsed.days / 365) != 0) Formatted.push(`${Math.trunc(parsed.days / 365)}y`)
    if (parsed.days != 0) Formatted.push(`${parsed.days % 365}d`)
    if (parsed.hours != 0) Formatted.push(`${parsed.hours}h`)
    if (parsed.minutes != 0) Formatted.push(`${parsed.minutes}m`)
    if (parsed.seconds != 0) Formatted.push(`${parsed.seconds}s`)
    if (parsed.milliseconds != 0) Formatted.push(`${parsed.milliseconds}ms`)

    return Formatted.join(' ')
}

module.exports = {
    objectMS,
    formatMS
}