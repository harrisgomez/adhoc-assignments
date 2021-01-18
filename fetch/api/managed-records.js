import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

const retrieve = options => {
    // Options for accepted by the /records endpoint, accepted as query string params
    const options = options || {};
    const limit = 10;
    const page = options.page || 1;

    // Build the URI for the records API
    const uri = URI(window.path)
        .addSearch('limit', limit)
        .addSearch('offset', limit * (page - 1));

    // Add 'color[]' param if options contains any colors
    if (options.colors && options.colors.length > 0) uri.addSearch('color[]', options.colors);

    // Fetch call to the records API
    return fetch(window.path)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to fetch from Records API. Error code ' + res.status);
            }
        })
        .then(data => {
            // Transform the payload upon successful promise response
        })
}

export default retrieve;
