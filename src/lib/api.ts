/**
 * Safe JSON fetch — converts HTML error pages into user-friendly messages.
 * Prevents "Unexpected token '<'" errors in client components.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    if (res.status === 401 || res.redirected) {
      throw new Error("Session expired. Please log in again.");
    }
    if (res.status === 403) {
      throw new Error("You don't have permission to perform this action.");
    }
    if (res.status === 404) {
      throw new Error("Resource not found.");
    }
    throw new Error(`Server error (${res.status}). Please try again.`);
  }

  const json = await res.json() as T & { success?: boolean; error?: string };

  if (typeof json === "object" && json !== null && "success" in json && !json.success) {
    throw new Error((json as { error?: string }).error || "Request failed.");
  }

  return json as T;
}
