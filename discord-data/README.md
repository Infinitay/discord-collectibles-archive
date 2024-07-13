Any and all Discord data will be stored here and prettified for ease of viewing with data changes.

# [Collections](/discord-data/collections/)

This directory contains the various collections parsed and exported as individual files via [generate-discord-collections](/discord-data/scripts/generate-discord-collections.ts) . The data found here is used for the collections data

## Data Descriptions

### [CollectiblesCategories -> Product](/src/types/CollectiblesCategories.d.ts)
The general product

| Property | Description | Value(s) |
|-------|-------|-------|
| type | The type of the general product (not to be confused with the individual item) | 0 = Avatar Decoration |
| 	   |                                                                               | 1 = Profile Effect |
| 	   |                                                                               | 1000 = Bundle |
| premium_type | The type that identifies the product's availability based on a group of users | 0 = Everyone |
|              |                                                                               | 2 = Discord Nitro |
| items | The individual item(s) found within the product | [Item[]](/discord-data/scripts/generate-discord-collections.ts) |
| bundled_products | The _actual_ products that are found within this bundle product type      | [BundledProduct[]](/discord-data/scripts/generate-discord-collections.ts)

### [CollectiblesCategories -> Product -> Item](/src/types/CollectiblesCategories.d.ts)
An individual item

| Property | Description | Value(s) |
|-------|-------|-------|
| type | The type of the individual item | 0 = Avatar Decoration |
| 	   |                                 | 1 = Profile Effect |

### [CollectiblesCategories -> Product -> BundledProduct](/src/types/CollectiblesCategories.d.ts)
An individual item, but for a BundledProduct 

| Property | Description | Value(s) |
|-------|-------|-------|
| type | The type of the individual item found within the bundle | 0 = Avatar Decoration |
| 	   |                                                         | 1 = Profile Effect |
| premium_type | The type that identifies the item's availability based on a group of users | 0 = Everyone |
|              |                                                                            | 2 = Discord Nitro |

### [CollectiblesCategories -> Product -> prices](/src/types/CollectiblesCategories.d.ts)
The price object containing the different prices for a given product. The table below contains the know keys and potential **price** descriptor (CollectiblesCategories -> Product -> prices -> [key] -> country_prices -> prices[] -> amount) - whether it's regular or nitro pricing. Additionally, the object format/values seems to be consistent despite different regions aside from the amount. 

| [key] | premium_type | amount (usd) | Price Description | App. Release | Collection | Product
|-------|-------|-------|-------|-------|-------|-------|
|   0   |   2   | $0.00 | Free, assumed full price | August 10, 2023 | DISXCORE | Cyberspace
|   5   |   2   | $3.99 | Free, assumed nitro price |                |          |           
|   0   |   0   | $3.99 | Full price | August 23, 2023 | Breakfast | Pancakes
|   4   |   0   | $2.99 | Nitro price |                |           | 
|   0   |   0   | $9.99 | Full price | August 23, 2023 | Fantasy | Treasure and Key
|   4   |   0   | $6.99 | Nitro price |                |         | 
|   5   |   0   | $9.99 | Full price |                 |         | 
|   7   |   0   | $6.99 | Nitro price |                |         | 
|   0   |   0   | $5.99 | Full price | May 28, 2024 | Arcade | Twinkle Trails
|   4   |   0   | $4.99 | Nitro price |                |     | 
|   5   |   0   | $5.99 | Full price |                 |     | 
|   7   |   0   | $4.99 | Nitro price |                |     | 

Given the data, I will be making the following assumptions:
- A key of `0` indicates full pricing - Everyone
- A key of `4` indicates discounted pricing - Nitro users

The reason I'm not using the keys `5` and `7` is because they aren't in every collection while `0` is in every product and `4` seems to only be missing from the `DISXORE` collection.

# [Raw Data](/discord-data/raw/)

This directory contains raw data that was returned by the Discord API. Essentially, this is the archive. The data is unmodified apart from being prettified after manually being updated.

## Data Descriptions

### Raw

-	collectibles-categories: Contains the latest avatar decorations and profile effects from Discord

-	user-profile-effects: Contains the latest profile effect data such as the different image layers from Discord

## Data Sources

### Avatar Decorations and Profile Effects

_Endpoint (Auth Req.): `https://discord.com/api/v9/collectibles-categories`_

| Parameter | Required? | Value | Default | Notes |
|-----------|-----------|-------|---------|-------|
| include_bundles | No | boolean | false | Whether or not to include bundle products within the returned categories where applicable |
| include_unpublished | No | boolean | false | Requires special permission. Based on the name, it determines whether or not to include unpublished items whether they are categories or products |
| country_code | No | ISO 3166-2 Country Code (e.g. `US`, `MX`, `FR`) | US (unconfirmed) | Changes the country pricing the the specified country code |

Discord returns a list of all currently available collectibles within their api. As the endpoint is named, the results are a collection of categories such as "Fantasy", "Elements", etc. followed by the available products within each category. It seems like the pricing is only returned as USD but I haven't tested to see if it's based on Geo-IP, language settings, etc. As of June 2024, I found they added a "include_bundles" parameter which seems to be new when compared to data from Fall 2023. Furthermore, I only noticed the newly added parameter when looking at requests made on the web client versus desktop application.

Possible changes to the data include product `type` changes, `sku_id` (it happened before), banner ids (it happened before), `unpublished_at` defining a timestamp, etc. As said before the data is known to change albeit not often. Some of the biggest changes from the initial release until now was the formatting from `category.products.styles.*_colors` removing all color data in different formats into a binary representation of the hexadecimal color value, and also `category.products.prices` changes. I have some old files, but there are lots of gaps and are incomplete. 

### Profile Effect Image Data

_Endpoint (Auth Req.): `https://discord.com/api/v9/user-profile-effects`_

Discord returns a list of all available profile effects on the platform, the user doesn't have to own them, and their respective data. Most importantly, this endpoint provides the detailed effect data telling us the exact resources, time and position data, etc. used to create the effect - the effect layers. There seems to be a different `animationType` for different effects, although I haven't looked into nor found the difference yet. The data contains the profile effects from previously released collections that were unpublished so it's safe to say this will should only include additions and data attribute changes, as in the past there wasn't such detailed effect data being returned I believe.

Discord's own resource asset URLs doesn't really match when looking at the previews on the shop versus the data returned in this endpoint. Using the data here, we can reliably construct the effect as well as having additional data that describes the effect or other resources to display the effect.