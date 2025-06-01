function generateRandomHexId(length: number = 16): string {
    // const hexChars = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm' + `${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds}`; // Valid characters for a hex ID
    const hexChars = `${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds}`; // Valid characters for a hex ID
    let hexId = '';

    for (let i = 0; i < length; i++) {
        hexId += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }

    return hexId;
}


export const generatedid = Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}${new Date().getUTCMilliseconds()}`)