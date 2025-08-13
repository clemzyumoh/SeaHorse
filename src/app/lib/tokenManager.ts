import Token from "../lib/model/Token"; // adjust the import
import { refreshToken } from "../api/setup/createAuth/route";
// utils/tokenManager.ts
let refreshTimeout: NodeJS.Timeout;
let isRefreshing = false;
export async function scheduleTokenRefresh() {
    // Clear any existing timeout
    if (isRefreshing) return;


    try {
      isRefreshing = true;
      if (refreshTimeout) clearTimeout(refreshTimeout);

      const latestToken = await Token.findOne().sort({ createdAt: -1 });
      if (!latestToken) {
        await refreshToken();
        return;
      }

      // Calculate remaining time (3 seconds after expiry)
      const expiryTime = new Date(latestToken.createdAt).getTime() + 24000; // 24s total
      const now = Date.now();
      const delay = Math.max(0, expiryTime - now - 21000); // Ensure 3s after

      refreshTimeout = setTimeout(async () => {
        await refreshToken();
        scheduleTokenRefresh(); // Reschedule for next cycle
      }, delay);
    } finally {
      isRefreshing = false; // Ensure flag reset
    }
 

  // Find the newest toke  const latestToken = await Token.findOne().sort({ createdAt: -1 });
  
 
}