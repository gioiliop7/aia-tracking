"use client";

import { useState, useEffect, useMemo } from "react";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { FlightData } from "@/helpers/types";
import Day from "@/components/Day";

export default function AirportDisplay() {
  const [activeTab, setActiveTab] = useState<"departures" | "arrivals">(
    "departures"
  );
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const getStatusColor = (statusClassName: string) => {
    if (statusClassName.includes("success")) return "text-green-400";
    if (statusClassName.includes("error")) return "text-red-400";
    if (statusClassName.includes("warning")) return "text-yellow-400";
    return "text-yellow-400";
  };

  // API fetching logic
  const fetchFlights = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "el-GR,el;q=0.9,en;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/json",
          origin: "https://www.aia.gr",
          referer: "https://www.aia.gr/el/traveller/ptiseis",
          "x-requested-with": "XMLHttpRequest",
        },
        body: JSON.stringify({
          term: "",
          airline: "",
          airport: "",
        }),
      });

      const result = await response.json();
      if (!result.hasError) {
        setIsLoading(false);
        setFlightData(result.data);
        setCurrentPage(1); // Reset to first page on new data
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    fetchFlights();
    // Refresh every 30 seconds
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: string) => {
    return time || "--:--";
  };

  // Memoize the flattened and paginated flights to avoid unnecessary re-renders
  const paginatedFlights = useMemo(() => {
    const allFlights =
      activeTab === "departures"
        ? flightData?.departures || []
        : flightData?.arrivals || [];

    // Flatten the array of flights from the nested structure (slot.flights)
    const flattenedFlights = allFlights.flatMap((slot) => slot.flights);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return flattenedFlights.slice(startIndex, endIndex);
  }, [activeTab, flightData, currentPage, itemsPerPage]);

  const totalFlights = useMemo(() => {
    const allFlights =
      activeTab === "departures"
        ? flightData?.departures || []
        : flightData?.arrivals || [];
    return allFlights.flatMap((slot) => slot.flights).length;
  }, [activeTab, flightData]);

  const totalPages = Math.ceil(totalFlights / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400">
      {/* Header */}
      <div className="bg-yellow-500 text-black p-4 border-b border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <div className="p-2 rounded mx-auto">
              <img
                className="max-w-[50%] md:max-w-[60%] mx-auto"
                src="https://media.aia.gr/assets/aiaportal/media/root/settings/aia-logo.svg"
                alt="AIA Logo"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                ATHENS INTERNATIONAL AIRPORT
              </h1>
              <p className="text-md md:text-lg">ELEFTHERIOS VENIZELOS</p>
            </div>
          </div>
          <Day />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-yellow-600">
        <div className="max-w-[80%] mx-auto flex flex-col sm:flex-row">
          {/* Changed to flex-col for small screens, then row */}
          <button
            onClick={() => {
              setActiveTab("departures");
              setCurrentPage(1); // Reset page on tab change
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-4 text-md sm:text-lg font-bold border-b sm:border-r border-yellow-600 transition-colors ${
              /* Adjusted padding, font size, and border */
              activeTab === "departures"
                ? "bg-yellow-500 text-black"
                : "text-yellow-400 hover:bg-gray-800"
            }`}
          >
            <PlaneTakeoff className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Adjusted icon size */}
            DEPARTURES
          </button>
          <button
            onClick={() => {
              setActiveTab("arrivals");
              setCurrentPage(1); // Reset page on tab change
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-4 text-md sm:text-lg font-bold transition-colors ${
              /* Adjusted padding and font size */
              activeTab === "arrivals"
                ? "bg-yellow-500 text-black"
                : "text-yellow-400 hover:bg-gray-800"
            }`}
          >
            <PlaneLanding className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Adjusted icon size */}
            ARRIVALS
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-[80%] mx-auto p-4 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            {/* Adjusted loader size */}
            <div className="text-yellow-400 text-lg sm:text-xl font-bold">
              {/* Adjusted font size */}
              LOADING FLIGHT INFORMATION...
            </div>
            <div className="text-yellow-400 text-sm mt-2">
              Connecting to Athens International Airport
            </div>
          </div>
        </div>
      )}

      {!isLoading && flightData && (
        <>
          {/* Flight Display */}
          <div className="max-w-[80%] mx-auto p-2 sm:p-4">
            {/* Adjusted padding */}
            {/* Column Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b border-yellow-600 text-yellow-400 font-bold text-sm lg:text-lg">
              {/* Hidden on small screens, smaller font for md */}
              <div className="col-span-1">TIME</div>
              <div className="col-span-1">FLIGHT</div>
              <div className="col-span-2">
                {activeTab === "departures" ? "TO" : "FROM"}
              </div>
              <div className="col-span-1">
                {activeTab === "departures" ? "GATE" : "BELT"}
              </div>
              <div className="col-span-1">
                {activeTab === "departures" ? "TERMINAL" : "EXIT"}
              </div>
              {activeTab === "departures" && (
                <>
                  <div className="col-span-2">CHECK IN</div>
                </>
              )}
              <div className="col-span-2">STATUS</div>
              <div className="col-span-1">REMARK</div>
              <div className="col-span-1">AIRLINE</div>
            </div>
            {/* Flight List */}
            <div className="space-y-1">
              {paginatedFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-2 sm:gap-4 py-2 sm:py-3 border-b border-gray-800 hover:bg-gray-900 transition-colors bg-gray-800 text-sm sm:text-base md:text-lg" /* Responsive grid, font size, and gap */
                >
                  <div className="col-span-1 text-yellow-400 font-bold text-lg md:text-xl">
                    {formatTime(flight.scheduledTime)}
                  </div>
                  <div className="flex flex-col col-span-1 text-yellow-400 font-bold text-base md:text-lg">
                    {/* Adjusted font size */}
                    <span>{flight.flightNum}</span>
                    <a
                      className="text-gray-200 text-xs md:text-sm" /* Adjusted font size */
                      target="_blank"
                      href={`https://www.flightradar24.com/data/flights/${flight.flightNum.replaceAll(
                        /\s/g,
                        ""
                      )}`}
                    >
                      TRACK
                    </a>
                  </div>
                  <div className="col-span-2 hidden md:flex gap-1">
                    {flight.airport
                      .toUpperCase()
                      .split("")
                      .map((char, index) => (
                        <div
                          key={index}
                          className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center bg-black text-yellow-400 text-lg md:text-xl font-bold rounded-md shadow-inner" /* Adjusted size */
                        >
                          {char}
                        </div>
                      ))}
                  </div>
                  <div className="col-span-1 text-yellow-400 font-bold text-base md:text-xl">
                    {activeTab === "departures"
                      ? flight.gate || "---"
                      : flight.baggageBeltNum || "---"}
                  </div>
                  <div className="col-span-1 text-yellow-400 font-bold text-base md:text-xl">
                    {activeTab === "departures"
                      ? flight.terminal || "---"
                      : flight.exit || "---"}
                  </div>
                  {activeTab === "departures" && (
                    <>
                      <div className="col-span-2 text-yellow-400 font-bold text-base md:text-xl">
                        {flight.checkInDesks}
                      </div>
                    </>
                  )}
                  <div className="col-span-2 flex gap-1 text-base md:text-xl font-bold">
                    {flight.statusText
                      .toUpperCase()
                      .split("")
                      .map((char, index) => (
                        <div
                          key={index}
                          className={`bg-black h-8 w-2 sm:h-max sm:w-3 flex items-center justify-center rounded shadow-inner ${getStatusColor(
                            flight.statusClassName
                          )}`}
                        >
                          {char}
                        </div>
                      ))}
                  </div>
                  <div className="col-span-1 text-yellow-400 text-xs sm:text-sm md:text-lg">
                    {flight.estimatedTime &&
                      flight.estimatedTime !== flight.scheduledTime && (
                        <span>EST: {flight.estimatedTime}</span>
                      )}
                    {flight.actualTime && <span>ACT: {flight.actualTime}</span>}
                  </div>
                  <div className="col-span-1 text-yellow-400 text-lg">
                    <img
                      className="max-w-[50%] md:max-w-[30%] mx-auto" /* Adjusted image size */
                      src={`https://www.aia.gr/${flight.airline.logoUrl}`}
                      alt={flight.airline.name}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-8 gap-2 sm:gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base" /* Adjusted padding and font size */
                >
                  Previous
                </button>
                <span className="text-base sm:text-xl font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base" /* Adjusted padding and font size */
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="bg-gray-900 border-t border-yellow-600 p-2">
        <div className="max-w-[80%] mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-center sm:text-left">
          <div className="text-yellow-400 mb-2 sm:mb-0">
            Last Updated: {flightData?.timeStamp}
          </div>
          <div className="text-yellow-400 mb-2 sm:mb-0">
            BY GIORGOS ILIOPOULOS
          </div>
          <div className="text-yellow-400">
            ATHENS INTERNATIONAL AIRPORT - ELEFTHERIOS VENIZELOS
          </div>
        </div>
      </div>
    </div>
  );
}
