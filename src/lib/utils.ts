/**
 * Shared auth utility functions for client-side usage
 */

/** Perform logout via server API */
export async function logout(): Promise<void> {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
        localStorage.removeItem("user");
        window.location.href = "/";
    } catch (e) {
        console.error("Logout failed:", e);
    }
}

/** Format currency in Indonesian Rupiah */
export function formatRupiah(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

/** Format date in Indonesian locale */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
