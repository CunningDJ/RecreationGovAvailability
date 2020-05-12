/*
  Recreation.gov Campsite Availability
  Fetches availabilty for a given campground and months, aggregates it and displays all availability dates in
    those months.

  Sample availability endpoint (with start date specifier):
     https://www.recreation.gov/api/camps/availability/campground/232487/month?start_date=2020-08-01T00%3A00%3A00.000Z
  Sample campsites endpoint:
     https://www.recreation.gov/api/camps/campsites/4522

*/

const RESERVED = "Reserved";
const AVAILABLE = "Available";
let CAMPGROUND = 232487;
let AVAILABILITY_YEAR = 2020;
let AVAILABILITY_MONTHS = [7,8,9];

const fetchCampsite = (campsite) => fetch(`https://www.recreation.gov/api/camps/campsites/${campsite}`);
const fetchAvailability = (campground, year, monthNum) => fetch(`https://www.recreation.gov/api/camps/availability/campground/${campground}/month?start_date=${String(year).padStart(4,'20')}-${String(monthNum).padStart(2,'0')}-01T00%3A00%3A00.000Z`);


/* COPY FROM HERE DOWN */
function displayCampsitesAvailability(availabilityData) {
    const campsitesAvailability = availabilityData.campsites;
    // MAP: {
    //  [site name (e.g. 'A10')]: [availability table for that site]
    // }
    const campsiteSiteAvailabilityMap = Object.keys(campsitesAvailability).reduce((agg, campsiteID) => {
        const csa = campsitesAvailability[campsiteID];
        const { site, availabilities } = csa;
        //console.log(`${campsiteNum}:`);
        const availDates = Object.keys(availabilities).reduce((dates, dt) => {
           const isAvail = availabilities[dt] === AVAILABLE;
           if (isAvail) {
            dates.push((new Date(dt)));
           }
           return dates;
        }, []);
       
        if (availDates.length > 0) {
            const availabilityTbl = createAvailabilityTable(site, availDates);
            agg[site] = availabilityTbl;
        }
        return agg;
    }, {});

    Object.keys(campsiteSiteAvailabilityMap).sort().forEach(site => {
        const availabilityTbl = campsiteSiteAvailabilityMap[site];
        document.body.appendChild(availabilityTbl);
    });
}

function createAvailabilityTable(site, availDates) {
    // console.log(`Creating Table for ${site}`);
    const tbl = document.createElement('table');
    tbl.setAttribute("style", "border: 2px solid black; margin: 5px; display: inline;");
    const thd = document.createElement('thead');
    const thdRow = document.createElement('tr');
    const thdCell = document.createElement('td');
    thdCell.setAttribute("style", "font-weight: bold;");
    thdCell.innerText = site;
    thdRow.appendChild(thdCell);
    thd.appendChild(thdRow);
    tbl.appendChild(thd);
   
    const tbod = document.createElement('tbody');
    tbod.setAttribute("style","border: 1px solid black;");
    tbl.appendChild(tbod);
    availDates.forEach(availDate => {
        const dateString = availDate.toLocaleDateString();
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        //cell.setAttribute("style","border: 1px solid black;");
        cell.innerText = dateString;
        row.appendChild(cell)
        tbod.appendChild(row);
    });
    return tbl;
}

function fetchAvailabilityAndDisplay(campgroundID, availabilityYear, availabilityMonths) {
    document.body.innerText = "";
    document.title = `Availability: ${CAMPGROUND}`;
    Promise.all(availabilityMonths.map(availMonth => fetchAvailability(campgroundID, availabilityYear, availMonth)))
        .then(responses => {
            console.log(`Availability fetched`);
            Promise.all(responses.map(resp => resp.json()))
                .then(monthlyAvailabilities => {
                    const aggregatedAvailability = monthlyAvailabilities.reduce((agg, avail) => {
                        Object.keys(avail.campsites).forEach(campsiteID => {
                            const cs = avail.campsites[campsiteID];
                            const currentAvailabilities = agg.campsites[campsiteID] ? agg.campsites[campsiteID].availabilities : {};
                            agg.campsites[campsiteID] = {
                                ...agg.campsites[campsiteID],
                                ...cs,
                                availabilities: {
                                    ...currentAvailabilities,
                                    ...cs.availabilities
                                }
                            }
                        });
                        return agg;
                    }, { campsites: {} });
                    displayCampsitesAvailability(aggregatedAvailability);
                })
        })
        .catch(err => console.log(err.message));
}

// MAIN
fetchAvailabilityAndDisplay(CAMPGROUND, AVAILABILITY_YEAR, AVAILABILITY_MONTHS);