export function formatStatus(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, '-');
}
