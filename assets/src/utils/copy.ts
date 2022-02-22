export default function (str: string) {
    return navigator.clipboard.writeText(str);
}
