// export const removeduplicateObject = (array) => {
//     return Array.from(
//         new Map(array.map((item: IUserfollowers) => [item._id, item])).values()
//     )
// }

// Generic function to remove duplicates from an array of objects
// export const removeduplicateObject = <T, K extends keyof T>(array: T[], key: K): T[] => {
//     return Array.from(new Map(array.map((item) => [item[key], item])).values());
// }
// Remove duplicates by '_id'
// const removeduplicate = removeduplicateObject<IUserfollowers, '_id'>(following, '_id');



// Generic function to remove duplicates from an array of objects by '_id'
export const removeDuplicateObject = <T extends { _id: string }>(array: T[]): T[] => {
    return Array.from(new Map(array.map((item) => [item._id, item])).values());
}