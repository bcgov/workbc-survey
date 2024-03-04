export const isValidHour = (hour: string) => {
    const num = Math.floor(Number(hour))
    return num !== Infinity && String(num) === hour && num >= 0 && num <= 23
}

export const isValidMinute = (hour: string) => {
    const num = Math.floor(Number(hour))
    return num !== Infinity && String(num) === hour && num >= 0 && num <= 59
}
