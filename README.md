# Recreation.gov Availability Tool
## Introduction
I built this tool one evening to help my sister see the availabile dates of all campsites
for a given campground and year and months. When the main function
(`fetchAvailabilityAndDisplay`) is run, it fetches all the necessary data from
the Recreation.gov API, aggregates and processes the fetched data for only the
available dates, and visualizes the available dates in HTML.

Because this fetches from the Recreation.gov API, it must be run in the Chrome
Developer Tools after navigating to the Recreation.gov webite in order to avoid CORS
errors.

## Possibilities
The `fetch`-specific portions of the code could be swapped out for
axios and then this could be run with NodeJS (except for the HTML part) as
a CLI tool for fetching this data.

## Instructions
1. Navigate to [https://recreation.gov]()
2. Open the Chrome Developer Tools (or equivalent for another browser).
3. Copy-paste [this code](/recreationGovAvailability) in.

To run it again with different parameters after running it the first time, run
```javascript
fetchAvailabilityAndDisplay([campground ID], [year], [months (array)])
```

Have fun and let me know your thoughts!
