"use server";

import { redis } from "@/lib/redis";
import { checkUserNameSchema } from "@/schema";

const USERNAME_HASH = "username_records";
export const checkUserName = async ({ username }: { username: string }) => {

    try {
        const parsed = checkUserNameSchema.safeParse({ username });
        if (!parsed.success) return true
        const normalizedUsername = parsed.data.username.toLowerCase();
        const exists = await redis.hexists(USERNAME_HASH, normalizedUsername);

        return !!exists
    } catch (error) {
        return false
    }
};