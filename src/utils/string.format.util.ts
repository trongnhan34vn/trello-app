export const capitalize = (value: string) => {
    if (!value) return '';
    const s = value.toLowerCase().trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
}