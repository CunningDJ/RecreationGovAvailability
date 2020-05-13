/*
  Recreation.gov Campsite Availability
  Fetches availabilty for a given campground and months, aggregates it and displays all availability dates in
    those months.
  Paste this code into the console after navigating to recreation.gov to build the app.

  Sample availability endpoint (with start date specifier):
     https://www.recreation.gov/api/camps/availability/campground/232487/month?start_date=2020-08-01T00%3A00%3A00.000Z
  Sample campground endpoint:
    https://www.recreation.gov/api/camps/campgrounds/250005
  Sample campsites endpoint:
     https://www.recreation.gov/api/camps/campsites/4522

  Sample campground website link:
    https://www.recreation.gov/camping/campgrounds/250005

*/

const fetchCampsite = (campsite) => fetch(`https://www.recreation.gov/api/camps/campsites/${campsite}`);
const fetchAvailability = (campground, year, monthNum) => fetch(`https://www.recreation.gov/api/camps/availability/campground/${campground}/month?start_date=${String(year).padStart(4,'20')}-${String(monthNum).padStart(2,'0')}-01T00%3A00%3A00.000Z`);
const fetchCampground = (campground) => fetch(`https://www.recreation.gov/api/camps/campgrounds/${campground}`);

const MONTHS_MAP = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

const DEFAULT_HEADER_BOX_STYLE_MIXIN = "border: 1px solid black; border-radius: 8px; text-align: center; background-color: #333; color: white;";
const DEFAULT_TITLE_BOX_STYLE = `${DEFAULT_HEADER_BOX_STYLE_MIXIN} padding: 6px;`;
const DEFAULT_H2_BOX_STYLE = `${DEFAULT_HEADER_BOX_STYLE_MIXIN} padding: 3px; margin: 10px 0px;`;

let DEFAULT_CAMPGROUND = 232487;

function setTitle(campgroundID) {
    if (campgroundID) {
        document.title = `Availability: ${campgroundID}`;
    } else {
        document.title = `Rec.gov Availability`;
    }
}

function campgroundWebsiteLink(campgroundID) {
    return `https://www.recreation.gov/camping/campgrounds/${campgroundID}`;
}

function createCampsitesAvailabilityTables(availabilityData) {
    const RESERVED = "Reserved";
    const AVAILABLE = "Available";

    const campsitesAvailability = availabilityData.campsites;
    // MAP: {
    //  [site name (e.g. 'A10')]: [availability table for that site]
    // }
    const campsiteSiteAvailabilityMap = Object.keys(campsitesAvailability).reduce((agg, campsiteID) => {
        const csa = campsitesAvailability[campsiteID];
        const { site, availabilities } = csa;
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

    const availabilityTables = Object.keys(campsiteSiteAvailabilityMap).sort().map(site => {
        const availabilityTbl = campsiteSiteAvailabilityMap[site];
        return availabilityTbl;
    });
    return availabilityTables;
}

function createAvailabilityTable(site, availDates) {
    // console.log(`Creating Table for ${site}`);
    const tbl = document.createElement('table');
    const thd = document.createElement('thead');
    const thdRow = document.createElement('tr');
    const thdCell = document.createElement('th');
    thdCell.innerText = site;

    thdRow.appendChild(thdCell);
    thd.appendChild(thdRow);
    tbl.appendChild(thd);
   
    const tbod = document.createElement('tbody');
    tbl.appendChild(tbod);
    availDates.forEach(availDate => {
        const dateString = availDate.toLocaleDateString();
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.innerText = dateString;
        row.appendChild(cell)
        tbod.appendChild(row);
    });
    return tbl;
}

function fetchAvailabilityandAggregate(campgroundID, availabilityYear, availabilityMonths, availabilityCallback) {
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
                    availabilityCallback(aggregatedAvailability);
                })
        })
        .catch(err => console.log(err.message));
}

function setUpUI(defaultCampground) {
    document.body.innerText = "";

    // Setting global styles
    const STYLE_RULES = `
        * {
            font-family: "Helvetica", Arial, sans-serif;
        }

        a {
            color: #5af;
        }

        button {
            background-color: #333;
            color: white;
            border-radius: 3px;
            border-color: black;
            padding: 6px;
            font-size: 1em;
        }

        button:hover {
            background-color: #666;
        }

        button:active {
            color: #999;
        }

        input {
            border: 1px solid #333;
            border-radius: 3px;
            margin: 6px 0px;
            padding: 3px;
        }

        label {
            margin: 6px 0px;
        }

        table {
            border: 2px solid black;
            margin: 5px;
            display: inline;
        }

        thead {}

        tbody {
            border: 1px solid black;
        }

        th {
            font-weight: bold;
        }

        th, td {
            text-align: center;
            vertical-align: middle;
        }
    `;
    const style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
        style.styleSheet.cssText = STYLE_RULES;
    } else {
        style.appendChild(document.createTextNode(STYLE_RULES));
    }
    document.getElementsByTagName("head")[0].appendChild(style);

    // Creating title box
    const titleBox = document.createElement('div');
    titleBox.setAttribute("style", DEFAULT_TITLE_BOX_STYLE);
    const titleElement = document.createElement('h1');
    titleElement.setAttribute("style", "text-align: center; margin: 0 auto;");
    const subTitleElement = document.createElement('h4');
    const anchorTagHtml = `<a href="https://www.recreation.gov/search?inventory_type=camping" target="_blank">Recreation.gov</a>`;
    subTitleElement.innerHTML = `Use this tool to see all available dates for selected months for a given campground ID from ${anchorTagHtml}`;
    titleBox.appendChild(titleElement);
    titleBox.appendChild(subTitleElement);

    document.body.appendChild(titleBox);
    setTitle();
    titleElement.innerText = "Recreation.gov Campsite Availability";

    const availabilityTablesSection = document.createElement('div');

    const availabilityTablesSectionHeaderBox = document.createElement('div');
    availabilityTablesSectionHeaderBox.setAttribute("style", DEFAULT_H2_BOX_STYLE);
    const availabilityTablesSectionHeader = document.createElement("h2");
    const availabilityTablesSectionAddress = document.createElement("h4");
    const availabilityTablesSectionLink = document.createElement("a");
    const availabilityTablesSectionEmail = document.createElement("h5");
    const availabilityTablesSectionPhone = document.createElement("h5");
    availabilityTablesSectionHeaderBox.appendChild(availabilityTablesSectionHeader);
    availabilityTablesSectionHeaderBox.appendChild(availabilityTablesSectionLink);
    availabilityTablesSectionHeaderBox.appendChild(availabilityTablesSectionAddress);
    availabilityTablesSectionHeaderBox.appendChild(availabilityTablesSectionEmail);
    availabilityTablesSectionHeaderBox.appendChild(availabilityTablesSectionPhone);

    const availabilityTablesSectionData = document.createElement('div');

    function availabilityCallback(aggregatedAvailability) {
        const tables = createCampsitesAvailabilityTables(aggregatedAvailability);
        if (tables.length > 0) {
            availabilityTablesSectionData.innerText = "";
            tables.forEach(tbl => {
                availabilityTablesSection.appendChild(tbl);
            });
        } else {
            availabilityTablesSectionData.innerText = "No availability found for these dates :(";
        }
    }

    function selectionCallback(selectionData) {
        const { campground, year, months } = selectionData;
        availabilityTablesSectionLink.innerText = "";
        availabilityTablesSectionAddress.innerText = "";
        availabilityTablesSectionEmail.innerText = "";
        availabilityTablesSectionPhone.innerText = "";

        fetchCampground(campground)
            .then(resp => resp.json())
                .then(({ campground: campgroundData}) => {
                    if (!campgroundData) {
                        availabilityTablesSectionHeader.innerText = `CAMPGROUND ${campground} NOT FOUND`;
                        return;
                    }
                    const {
                        facility_name,
                        addresses,
                        facility_email: email,
                        facility_phone: phone
                    } = campgroundData;
                    availabilityTablesSectionHeader.innerText = `Availability: ${facility_name}`;
                    setTitle(facility_name);

                    availabilityTablesSectionLink.href = campgroundWebsiteLink(campground);
                    availabilityTablesSectionLink.innerText = 'Recreation.gov Page';
                    availabilityTablesSectionLink.target = "_blank";

                    if (addresses && addresses.length > 0) {
                        const { address1, city, state_code, postal_code } = addresses[0];
                        availabilityTablesSectionAddress.innerText = `${address1}, ${city}, ${state_code} ${postal_code}`;
                    }
                    if (email && email.length > 0) {
                        availabilityTablesSectionEmail.innerText = `Email: ${email}`;
                    }
                    if (phone && phone.length > 0) {
                        availabilityTablesSectionPhone.innerText = `Phone: ${phone}`;
                    }
                })
                .catch(err => console.log(err.message))
            .catch(err => console.log(err.message));

        setTitle(campground);

        availabilityTablesSection.innerText = "";
        availabilityTablesSection.appendChild(availabilityTablesSectionHeaderBox);
        availabilityTablesSection.appendChild(availabilityTablesSectionData);

        availabilityTablesSectionHeader.innerText = `Availability: Campground ${campground}`;
        availabilityTablesSectionData.innerText = "Loading ...";

        fetchAvailabilityandAggregate(campground, year, months, availabilityCallback);
    }
    const userInputSection = createUserInputSection(defaultCampground, selectionCallback);
    document.body.appendChild(userInputSection);
    document.body.appendChild(availabilityTablesSection);
}

function createUserInputSection(defaultCampground, selectionCallback) {
    // selectionCallback takes object with: { year, campground, months }
    const DEFAULT_BOX_MARGIN = "6px 0px";

    // Default availability year set to current year
    const defaultAvailabilityYear = (new Date()).getFullYear();

    const campgroundInputBox = document.createElement('div');
    campgroundInputBox.id = "campground-input-box";
    campgroundInputBox.style.margin = DEFAULT_BOX_MARGIN;
    campgroundInputBox.style.padding = "5px";
    const campgroundLabel = document.createElement('label');
    campgroundLabel.innerText = "Campground ID";
    campgroundLabel.style.fontWeight = "bold";
    const campgroundInput = document.createElement('input');
    campgroundInput.value = defaultCampground;
    campgroundInput.required = true;
    campgroundInput.style.display = "block";
    campgroundInputBox.appendChild(campgroundLabel);
    campgroundInputBox.appendChild(campgroundInput);

    const yearInputBox = document.createElement('div');
    yearInputBox.id = "year-input-box";
    yearInputBox.style.margin = DEFAULT_BOX_MARGIN;
    yearInputBox.style.padding = "5px";
    const yearLabel = document.createElement('label');
    yearLabel.innerText = "Year";
    yearLabel.style.fontWeight = "bold";
    const yearInput = document.createElement('input');
    yearInput.type = "number";
    yearInput.required = true;
    yearInput.value = defaultAvailabilityYear;
    yearInput.style.display = "block";
    yearInputBox.appendChild(yearLabel);
    yearInputBox.appendChild(yearInput);

    let selectedMonths = [];
    function clickCheckBox(e) {
        const { value, checked } = e.target;
        const selectedMonthsSet = new Set(selectedMonths);
        if (checked) {
            selectedMonthsSet.add(value);
        } else {
            selectedMonthsSet.delete(value);
        }
        selectedMonths = Array.from(selectedMonthsSet);
        console.log(`Selected Months: ${JSON.stringify(selectedMonths)}`);
    }

    const monthsBox = document.createElement('div');
    monthsBox.id = "months-box";
    monthsBox.style.margin = DEFAULT_BOX_MARGIN;
    monthsBox.style.padding = "5px";
    const monthsLabel = document.createElement('label');
    monthsLabel.style.fontWeight = "bold";
    monthsLabel.innerText = "Months";
    const monthsRadioButtons = Object.keys(MONTHS_MAP).map(month => {
        const monthName = MONTHS_MAP[month];
        const cid = `checkbox-${monthName}`;
        const d = document.createElement('div');
        const checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.value = String(month);
        checkBox.id = cid;
        checkBox.name = cid;
        checkBox.onclick = clickCheckBox;

        const label = document.createElement('label');
        label.for=cid;
        label.innerText = monthName;
        label.style.margin = "auto 6px";

        d.appendChild(checkBox);
        d.appendChild(label);

        return d;
    });
    monthsBox.appendChild(monthsLabel);
    monthsRadioButtons.forEach(mrb => monthsBox.appendChild(mrb));

    function submit(e) {
        e.preventDefault();
        const campground = campgroundInput.value;
        const availabilityYear = yearInput.value;
        if (!(campground && campground.length > 0)) {
            return alert(`Need to give a campground ID`);
        }
        if (!(selectedMonths.length > 0)) {
            return alert(`Need to select at least one month for availability`);
        }

        selectionCallback({ campground, year: availabilityYear, months: selectedMonths });
    }

    const submitButton = document.createElement('button');
    submitButton.type = "button";
    submitButton.onclick = submit;
    submitButton.innerText = "Submit";

    const userInputSection = document.createElement('div');
    const header = document.createElement('h2');
    header.innerText = "Select Campground Availability";

    document.createElement('div')
    userInputSection.appendChild(header);
    userInputSection.appendChild(campgroundInputBox);
    userInputSection.appendChild(yearInputBox);
    userInputSection.appendChild(monthsBox);
    userInputSection.appendChild(submitButton);

    return userInputSection;
}

// MAIN
setUpUI(DEFAULT_CAMPGROUND);
