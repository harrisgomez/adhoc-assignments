import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

// Helper fn. Adds 'isPrimary' key to each item in records, then
// sets the value to true/false depending on whether or not item contains a primary color.
const setPrimaryColors = records => {
    const primaryColors = ['red', 'blue', 'yellow'];

    records.forEach(item => {
        item.isPrimary = primaryColors.some(pColor => item.color.includes(pColor))
    });

    return records;
};

const retrieve = (options = {}) => {
    // Options for the /records endpoint, accepted as query string params
    let limit = 10;
    let page = options.page || 1;

    // Build the URI for the records API
    const uri = URI(window.path)
        .addSearch('limit', limit + 1)
        .addSearch('offset', limit * (page - 1));

    // Add 'color[]' param if options contains any colors
    if (options.colors && options.colors.length > 0) uri.addSearch('color[]', options.colors);

    // Fetch call to the records API
    return fetch(uri)
        .then(res => {
            if (!res.ok) throw new Error(res.status + '. Records API failed.');
            return res.json();
        })
        .then(records => {
            // Check items for primary colors
            setPrimaryColors(records);

            // Check if on the last page
            const isLastPage = records.length <= limit;

            if (!isLastPage) records.splice(limit, 1);

            // Transform the payload upon successful promise response
            const result = {
                ids: records.map(item => item.id),
                open: records.filter(item => item.disposition === 'open'),
                closedPrimaryCount: records.filter(item => item.disposition === 'closed' && item.isPrimary).length,
                previousPage: page === 1 ? null : page - 1,
                nextPage: isLastPage ? null : page + 1
            };

            return result;
        })
        .catch(console.log);
};

export default retrieve;
