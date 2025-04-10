import dotenv from "dotenv";
import path from "path";
// Removed vi import and next/server mock

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Add any other global test setup here
