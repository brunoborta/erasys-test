import { unstable_cache } from "next/cache";
import { getProfile as getProfileOriginal } from "@borta/user-pictures";

// Cache getProfile so it doesn't take 
export const getProfile = unstable_cache(
  async () => getProfileOriginal(),
  ['profile-data'],
  { 
    revalidate: 300, // 5 minutes
    tags: ['profile']
  }
);
