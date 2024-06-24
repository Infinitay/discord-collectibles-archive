// https://discord.com/developers/docs/reference#snowflakes
const snowflakeToDate = (snowflake: string | BigInt): Date => {
	if (typeof snowflake === "string") {
		snowflake = BigInt(snowflake);
	}
	// (snowflake >> 22) + 1420070400000
	// Make sure to cast 22 to BigInt too by doing 22n
	return new Date(Number((snowflake as bigint) >> 22n) + 1420070400000);
};

export const DiscordUtils = {
	snowflakeToDate
};
