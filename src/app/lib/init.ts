

// lib/init.ts (new file)
import { scheduleTokenRefresh } from './tokenManager';
//const { scheduleTokenRefresh } = require("./tokenManager");
//const require( './model/Token'); // Ensure model registration

if (typeof window === 'undefined') { // Server-side only
  scheduleTokenRefresh();
}