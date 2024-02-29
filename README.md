# Air Quality Dashboard

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Requirements

You have 7 days to complete and submit the code. After submission, the team will review, and if the candidate did well schedule an L2. At the L2 interview, the team will go over the submission with the candidate and review.

Application Requirements

Build a mobile-responsive application that will fetch the Air Quality Index (AQI) scores from one or more free API like the following.

<https://openaq.org/>

<https://aqicn.org/>

When the application is launched there should be a landing screen.
After the data is fetched from the API, the AQI should be presented to the user in a clean and concise manner.
The AQI data fetched should be determined by the user’s location.
The user latitude and longitude should also be displayed along with the city name and weather station from which the data was fetched.
Bonus

Display AQI information for one day prior and one day in the future.
The user could have the ability to enter another location from which to fetch AQI information.
Code can be placed in a public GitHub or shared via ZIP, ensure the node_modules is not included

## Summary

- Deployed/Live version: <https://aq-dashboard.netlify.app/>

Currently the base route / landing page utilizes the request information to gather the user's location based on their IP. With their IP data we can also obtain ther geo data, specifically their latitude and longitude (approximate). These coordinates are then passed in as query parameters to the OpenAQ API endpoint to fetch measurement data near to those coordinates.

Once we receive data, we then process it to obtain an Air Quality Index. The index is calculated based on <https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf>

Furthermore, there is a link for the user to fetch and view their AQI data for yesterday. Additionally, there is a client side browser-based location request that can be found on the `/client` route.

### Disclaimer

This is not a perfect application and there are limitations and edge-cases since this was developed on my free time, with a limited scope. Feel free to share comments and suggestions. Thank you for reading.
