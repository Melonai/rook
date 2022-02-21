// Returns a fairly random id string, which can
// then be used for keys in each blocks.
export default function (length: number): string {
    const chars = "0123456789abcdef";

    return Array(length)
        .fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
}
