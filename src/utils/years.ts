export const years = (function () {
    return () => {
        const years = []
        for (var i = 0; i < 200; i++) {
            years.push(1900 + i)
        }
        return years || []
    }
})()