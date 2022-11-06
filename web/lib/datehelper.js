export default class {
    static reverseGregorian(date) {
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, 0) + "-" +
            String(date.getDate()).padStart(2, 0);
    }

    static compare(date1, date2) {
        let d1 = this.reverseGregorian(date1);
        let d2 = this.reverseGregorian(date2);

        return d1.localeCompare(d2);
    }
}