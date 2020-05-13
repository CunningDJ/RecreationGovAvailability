# Recreation.gov Availability Tool
## Introduction
I built this tool one evening to help my sister see the availabile dates of all campsites
for a given campground from Recreation.gov (all state and national parks), along with a set of months and year. It is written entirely in vanilla JS.  When the main function
(`fetchAvailabilityAndDisplay`) is run, it fetches all the necessary data from
the Recreation.gov API, aggregates and processes the fetched data for only the
available dates, and visualizes the available dates in HTML.

Because this fetches from the Recreation.gov API, it must be run in the Chrome
Developer Tools after navigating to the Recreation.gov webite in order to avoid CORS
errors.

## Possibilities
The `fetch`-specific portions of the code could be swapped out for
axios and then this could be run with NodeJS (except for the HTML part) as
a CLI tool for fetching this data.  If you do this, be polite with the data.  This tool was made for a single person to use here or there, not so that people could hammer the API with automated tools or the backend of a website.

## Instructions
1. Navigate to [https://recreation.gov]()
2. Open the Chrome Developer Tools (or equivalent for another browser) and open the Console tab.
3. Copy-paste [this code](/recreationGovAvailability.js) in the Console.

The UI should appear.  From there, you can choose what campground ID, year, and months that you want to check availability. A sample campground ID and current year are provided as starting points.  Once submitted, all the available dates in the months requested will be given, along with key information about the campground.

Have fun and let me know your thoughts/improvements!
