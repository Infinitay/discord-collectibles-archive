# [Discord Collectibles Archive](https://discord-collectibles-archive.vercel.app/)

An easily viewable archive of the various collections, or profile items, found on Discord

##

Currently there is a live version of the site deployed at https://discord-collectibles-archive.vercel.app/ thanks to Vercel.

## What Are Collectibles?

Collectibles seems to be what Discord classifies as avatar decorations and profile effects that was added as a new feature on [October 12, 2023](https://discord.com/blog/avatar-decorations-collect-and-keep-the-newest-styles). Collectibles are commonly found and purchased within the Discord shop which you can find by going to your _Discord User Settings_ -> _Profiles_ -> Click _Go to Shop_. Occasionally, Discord seems to release collectibles such as avatar decorations during events albeit temporary. These temporary collectibles doesn't get listed in their API once removed as well as expired collectible collections.

## Data Source & Updates

The data as of now is being fetched manually by myself, and I am doing it from time-to-time as I see quests available on the account or new shop updates.

Also, I want to thank @happyenderman's data-mining efforts for helping me retrieve the lost data (as of June 2024) for some of the collections such as _Monsters_, _Winder Wonderland_, and _Lunar New Year_. I used the data he gathered for at least these collections and refactored it to merge it with the rest from my old data I managed to save in time.

<details>
	<summary>Data Source Table</summary>

![Data Source Table](https://i.imgur.com/0WKo7zN.png)

</details>

## Tech Stack

Created using the [T3 Stack](https://create.t3.gg/).

-   TypeScript
-   React w/ NextJS
-   Tailwind CSS
