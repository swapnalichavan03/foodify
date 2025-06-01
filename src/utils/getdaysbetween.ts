import moment from "moment";

export const getDaysBetween = (function () {
    return (start: string, end: string) => {

        if (moment(start).format("DD/MM/yyyy") < moment(end).format("DD/MM/yyyy")) {
            for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
                arr.push(moment(dt).format());
            }
            return arr;
        } else {
            for (var arr = [], dt = new Date(end); dt <= new Date(start); dt.setDate(dt.getDate() + 1)) {
                arr.push(moment(dt).format());
            }
            return arr;
        }

        /* for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(moment(dt).format());
        }
        return arr; */
    }
})();