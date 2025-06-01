// export const convertTime = (totalSeconds: number = 0) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const secs = totalSeconds % 60;

//     // Format as HH:MM:SS
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
// };


// export const convertTime = (totalSeconds: number) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const secs = totalSeconds % 60;

//     let timeString = '';

//     if (hours > 0) {
//         timeString += `${String(hours).padStart(2, '0')}:`;
//     }

//     if (minutes > 0 || hours > 0) {
//         timeString += `${String(minutes).padStart(2, '0')}:`;
//     }

//     if (secs > 0 && hours === 0) {
//         timeString += `${String(secs).padStart(2, '0')}`;
//     }

//     return timeString.trim() || '0';
// };

export const convertTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    let timeString = '';

    if (hours > 0) {
        timeString += `${String(hours).padStart(2, '0')}:`;
    }

    // Always show minutes with leading zeros
    timeString += `${String(minutes).padStart(2, '0')}:`;

    // Always show seconds with leading zeros
    timeString += `${String(secs).padStart(2, '0')}`;

    return timeString;
};