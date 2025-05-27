import { useEffect, useMemo, useState } from "react";
import { EventCalendar } from "./EventCalendar";
import { format } from "date-fns";

const countries = [
  { name: "United States", code: "US" },
  { name: "India", code: "IN" },
  { name: "United Kingdom", code: "GB" },
  { name: "Germany", code: "DE" },
  { name: "Canada", code: "CA" },
  { name: "France", code: "FR" },
  { name: "Australia", code: "AU" },
  { name: "Japan", code: "JP" },
  { name: "Italy", code: "IT" },
  { name: "Brazil", code: "BR" },
];

export default function App() {
  const today = new Date();
  const [events, setEvents] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${selectedCountry}`);
        const data = await res.json();
        const formatted = data.map(event => ({
          date: event.date,
          title: event.localName,
        }));
        setEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
        setEvents([]);
      }
    };

    fetchHolidays();
  }, [selectedCountry, year]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Country Holiday Calendar</h1>
        <select
          className="border px-3 py-2 rounded text-sm"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <EventCalendar events={events} />
    </div>
  );
}
