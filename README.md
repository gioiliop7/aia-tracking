

# Athens International Airport Display

This project is a real-time flight information display for Athens International Airport "Eleftherios Venizelos". It fetches live departure and arrival data, presents it in a clear, easy-to-read format, and includes features like pagination, automatic refresh, and mobile responsiveness.

## Features

* **Real-time Flight Data:** Fetches live departure and arrival information from the Athens International Airport API.
* **Toggleable Views:** Switch between "Departures" and "Arrivals" with a single click.
* **Clear Status Indicators:** Flight statuses are displayed with color-coded text for quick identification (e.g., green for success, red for error, yellow for warning/default).
* **Flight Tracking Integration:** "TRACK" link for each flight to view its real-time position on FlightRadar24.
* **Pagination:** Displays flights in manageable chunks (10 items per page) with navigation controls.
* **Automatic Refresh:** Flight data is automatically refreshed every 30 seconds to ensure up-to-date information.
* **Mobile Responsive:** The layout adjusts dynamically to provide an optimal viewing experience on various screen sizes, from mobile phones to large desktops.
* **Loading State:** A clear loading indicator is shown while flight data is being fetched.
* **Dynamic Information:** Displays relevant information such as scheduled time, flight number, destination/origin, gate/belt, terminal/exit, check-in desks (for departures), status, estimated/actual times, and airline logo.

## Technologies Used

* **React.js:** Frontend library for building the user interface.
* **Next.js:** React framework for server-side rendering and API routes. (Assumed from `use client` directive and `/api/proxy` endpoint).
* **TypeScript:** For type safety and improved code quality.
* **Tailwind CSS:** For rapid and responsive UI development.
* **Lucide React:** Icon library for plane takeoff/landing icons.

## Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

1.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build

```

This will create an optimized production build in the `.next` folder.

### Running the Production Build

Bash

```
npm start
# or
yarn start

```

## How it Works

The `AirportDisplay` component utilizes React hooks:

-   `useState` for managing component state (active tab, flight data, loading status, pagination).
-   `useEffect` for fetching data from the `/api/proxy` endpoint on component mount and setting up an interval for automatic refreshes.
-   `useMemo` to memoize the paginated flights and total flights, optimizing performance by preventing unnecessary re-calculations on re-renders.

The `fetchFlights` function makes a `POST` request to the `/api/proxy` endpoint. This proxy then forwards the request to the actual Athens International Airport API.

The UI is built with Tailwind CSS, providing a highly customizable and responsive design. The use of responsive utility classes (`sm:`, `md:`, `lg:`) ensures a consistent and pleasant user experience across various device sizes.

## Potential Improvements

-   **Error Handling UI:** Display a more user-friendly message when API fetching fails.
-   **Accessibility:** Improve keyboard navigation and screen reader support.
-   **Filtering/Searching:** Add options to filter flights by airline, flight number, or destination/origin.
-   **Sorting:** Allow users to sort flights by time, flight number, or status.
-   **More Detailed Flight Info:** Expand the flight details section with additional information if available from the API (e.g., aircraft type).
-   **Theming:** Provide options for different color themes.
-   **Timezone Handling:** Ensure time display is robust across different user timezones.
