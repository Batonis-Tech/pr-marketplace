export const convertDateToStringForBackend = (value: Date): string => {
    let year = `${value.getFullYear()}`
    let month = `${value.getMonth() + 1}`
    let day = `${value.getDate()}`
    day = day.length > 1 ? day : "0" + day
    month = month.length > 1 ? month : "0" + month
    return `${year}-${month}-${day}`
}