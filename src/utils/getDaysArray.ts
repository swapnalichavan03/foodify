// import moment from "moment";

// export const getDaysArray = (function () {
//     const namesSmall = Object.freeze(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
//     const namesLarge = Object.freeze(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
//     return (year: number, month: number) => {
//         const monthIndex = month - 1
//         const date = new Date(year, monthIndex, 1);
//         const result = [];
//         while (date.getMonth() == monthIndex) {
//             result.push({
//                 date: moment(date).format(), day: {
//                     small: namesSmall[date.getDay()],
//                     lagre: namesLarge[date.getDay()],
//                 }
//             });
//             date.setDate(date.getDate() + 1);
//         }
//         [...Array(new Date(result[0].date).getDay()).keys()].map(day => result.unshift({
//             date: null,
//             day: {
//                 small: null,
//                 lagre: null,
//             }
//         }));

//         return result;
//     }
// })();

import moment from "moment";

export const getDaysArray = (function () {
    const namesSmall = Object.freeze(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
    const namesLarge = Object.freeze(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
    
    return (year: number, month: number) => {
        const monthIndex = month - 1; // Convert to 0-indexed month
        const firstDayOfMonth = new Date(year, monthIndex, 1);
        const lastDayOfMonth = new Date(year, monthIndex + 1, 0); // Last day of the current month
        
        const result = [];
        
        // Get previous month's last few days
        const prevMonth = new Date(year, monthIndex, 0); // Start from the end of the previous month
        const daysInPrevMonth = prevMonth.getDate(); // Get the number of days in the previous month
        const startDay = firstDayOfMonth.getDay(); // What day of the week is the first day of this month?
        
        // Add previous month's days
        let prevMonthDay = daysInPrevMonth - startDay + 1;
        for (let i = 0; i < startDay; i++) {
            result.push({
                date: moment(new Date(year, monthIndex - 1, prevMonthDay++)).format(),
                day: {
                    small: namesSmall[(startDay - i + 6) % 7], // Get previous month's day name
                    large: namesLarge[(startDay - i + 6) % 7],
                },
                isPrevMonth: true,
            });
        }
        
        // Add current month's days
        let currentDate = new Date(year, monthIndex, 1);
        while (currentDate.getMonth() === monthIndex) {
            result.push({
                date: moment(currentDate).format(),
                day: {
                    small: namesSmall[currentDate.getDay()],
                    large: namesLarge[currentDate.getDay()],
                },
                isPrevMonth: false,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Add next month's days to fill the last week
        const endDay = lastDayOfMonth.getDay();
        let nextMonthDay = 1;
        for (let i = endDay + 1; i < 7; i++) {
            result.push({
                date: moment(new Date(year, monthIndex + 1, nextMonthDay++)).format(),
                day: {
                    small: namesSmall[i],
                    large: namesLarge[i],
                },
                isNextMonth: true,
            });
        }

        return result;
    }
})();
