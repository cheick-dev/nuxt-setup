// utils/format.ts
export function format(n: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF"
    }).format(n);
}