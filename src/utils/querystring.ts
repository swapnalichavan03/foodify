// export const QueryString = (string: any) => {
//     return new URLSearchParams(string).toString()
// }


export const QueryString = (string: Record<string, any>) => {
    return new URLSearchParams(
      Object.entries(string).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? JSON.stringify(value) : String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
};