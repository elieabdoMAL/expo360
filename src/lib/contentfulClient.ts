import { createClient } from "contentful";

const spaceId: string = process.env.NEXT_PUBLIC_CTF_SPACE_ID || "your_space_id";
const accessToken: string =
  process.env.NEXT_PUBLIC_CTF_ACCESS_TOKEN || "your_access_token";

export const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});
