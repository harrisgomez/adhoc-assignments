const fs = require('fs');
const csv = require('csvtojson');
const { Parser } = require('json2csv');

const loadCsv = async () => {
    // Load in the .csv files to be parsed
    const slcsp = await csv().fromFile('slcsp.csv');
    const zips = await csv().fromFile('zips.csv');
    const plans = await csv().fromFile('plans.csv');

    // Find the states in 'zips' that match the corresponding zipcodes in 'slcsp'
    const statesMatchingZip = slcsp.map(item => zips.find(zip => zip.zipcode === item.zipcode));

    // Get the states and rate areas in 'plans' that match the states and rate areas found in 'zips'
    // Filter for the ones with available Silver plans
    const silverPlans = statesMatchingZip.map(state => plans.filter(plan => {
        return (
            plan.state === state.state
            && plan.rate_area === state.rate_area
            && plan.metal_level === 'Silver'
        );
    }));

    // Order the silver plans by rate from cheapest to most expensive
    const orderedPlanRates = silverPlans.map(plan => plan.sort((a, b) => a.rate - b.rate));

    // If available, choose the second lowest cost of the remaining plans and return their rate, otherwise, return 'null'
    const slcspPerState = orderedPlanRates.map(planRates => {
        if (!planRates.length) {
            return null;
        } else if (planRates.length > 1) {
            return planRates[1];
        } else {
            return planRates[0];
        }
    });

    // Assign the rates to the matching zipcodes in slcsp
    for (let i = 0; i < slcsp.length; i++) {
        slcsp[i].rate = slcspPerState[i] ? slcspPerState[i].rate : '';
    }

    // Output the original order of the rows without any quotation marks
    const output = new Parser({
        fields: ['zipcode', 'rate'],
        quote: ''
    }).parse(slcsp);


    // Choose an output file to write to, or save over the original 'slcsp.csv' file
    fs.writeFileSync('output.csv', output);
};

loadCsv();