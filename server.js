import http from 'node:http'
import { getDataFromDB } from './database/db.js'
import sendJSONResponse from './utils/sendJSONResponse.js'
import getDataByPathParams from './utils/getDataByPathParams.js'
import getDataByQueryParams from './utils/getDataByQueryParams.js'
const PORT = 8080

const server = http.createServer(async (req, res) => {
    const destinations = await getDataFromDB()

    // Use the URL constructor and pass in the relative and base urls.
    const urlObj = new URL(req.url, `http://${req.headers.host}`)

    // Use the fromEntries() method on the Object class .
    const queryObj = Object.fromEntries(urlObj.searchParams)


    if (urlObj.pathname === '/api' && req.method === 'GET') {

        let filteredDestinations = getDataByQueryParams(destinations, queryObj)

        sendJSONResponse(res, 200, filteredDestinations)

    } else if (req.url.startsWith("/api/continent") && req.method === 'GET') {

        const continent = req.url.split("/").pop()
        const continentData = getDataByPathParams(destinations, "continent", continent)
        sendJSONResponse(res, 200, continentData)

    } else if (req.url.startsWith("/api/country") && req.method === 'GET') {

        const country = req.url.split("/").pop()
        const countryData = getDataByPathParams(destinations, "country", country)
        sendJSONResponse(res, 200, countryData)

    } else {

        sendJSONResponse(res, 404, ({ error: "not found", message: "The requested route does not exist" }))

    }

})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))
