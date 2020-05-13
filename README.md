# Recreation.gov Availability Tool
## Introduction
I built this tool one evening to help my sister see the availabile dates of all campsites
for a given campground from Recreation.gov (all state and national parks), arguments of the year and any combination of months. I then expanded it into a UI that also fetches basic data on the campground along with inputs for the campground ID, year and months for reusability.  It is written entirely in vanilla JS, and is a copy-paste web app.  The code is pasted into the console, and the web app with UI and fetching ability is immediately built.

When a given campground and months are submitted, it fetches and aggregates all the availability data for the given months and campground from the Recreation.gov API, and visualizes the available dates per campsite in tables.

Just like any website, the campground ID and months and year can be changed and submitted, and availability data for those parameters will be fetched and visualized.

Because this fetches from the Recreation.gov API, it must be run in the Chrome Developer Tools **after** navigating to the Recreation.gov webite in order to avoid CORS errors.

## Instructions
1. Navigate to [https://recreation.gov]()
2. Open the Chrome Developer Tools (or equivalent for another browser) and open the Console tab.
3. Copy-paste [this code](/recreationGovAvailability.js) in the Console.

The UI should appear.  From there, you can choose what campground ID, year, and months that you want to check availability. A sample campground ID and current year are provided as starting points.  Once submitted, all the available dates in the months requested will be given, along with key information about the campground.

## Possibilities
The `fetch`-specific portions of the code could be swapped out for axios and then this could be run with NodeJS (except for the HTML part) as a CLI tool for fetching this data.  If you do this, be polite with the data.  This tool was made for a single person to use here or there, not so that people could hammer the API with automated tools or the backend of a website.

Have fun and let me know your thoughts/improvements!
