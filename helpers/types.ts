export interface Airline {
  name: string
  logoUrl: string
}

export interface Flight {
  id: string
  flightNum: string
  airline: Airline
  scheduledTime: string
  estimatedTime: string
  actualTime: string
  airport: string
  transit: string
  baggageBeltNum: string | null
  baggageBeltNote: string | null
  nextInfo: string | null
  statusText: string
  statusClassName: string
  gate: string | null
  exit: string | null
  checkInDesks: string | null
  codeshare: string
  terminal: string | null
  href: string
}

export interface FlightSlot {
  slot: string
  flights: Flight[]
}

export interface FlightData {
  timeStamp: string
  arrivals: FlightSlot[]
  departures: FlightSlot[]
}