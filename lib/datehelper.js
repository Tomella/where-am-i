export default class {
    static reverseGregorian(date) {
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, 0) + "-" +
            String(date.getDate()).padStart(2, 0);
    }
}