export function stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, "");
}

export function isSafeUrl(url: string): boolean {
    const forbidden = ["javascript:", "data:", "vbscript:"];
    const lower = url.toLowerCase().trim();
    return !forbidden.some((prefix) => lower.startsWith(prefix));
}
