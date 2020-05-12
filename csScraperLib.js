function getAllCampsitesDataFromAvailability(availabilityData) {
    // console.log(`AD: ${JSON.stringify(availabilityData,null,2)}`)
    Promise.all(Object.keys(availabilityData.campsites).map(fetchCampsite))
        .then(campsitesResponses => {
            Promise.all(campsitesResponses.map(resp => resp.json()))
                .then(campsites => {
                    campsites = campsites.map(item => item.campsite);
                    console.log(`campsites: ${JSON.stringify(campsites,null,2)}`);
                    // Savings the campsitesData
                    cd = campsitesData;
                })
        })
        .catch(err => console.log(err.message));
}