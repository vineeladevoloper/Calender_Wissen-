import { lastDayOfMonth, startOfMonth, format } from "date-fns";
import { useMemo, useState } from "react";
import { FaBackward, FaForward } from "react-icons/fa";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MonthWiseCalendar = ({ eventsMapper, month, year, showHolidays }) => {
  const today = new Date(year, month);
  const firstDateOfMonth = startOfMonth(today);
  const lastDate = lastDayOfMonth(today).getDate();
  const firstDay = firstDateOfMonth.getDay();
  const netToday = new Date();

  const currentMonthMapper = useMemo(() => {
    return Object.keys(eventsMapper).reduce((acc, key) => {
      const date = new Date(key);
      if (date.getMonth() !== month || date.getFullYear() !== year) return acc;
      const day = date.getDate();
      acc[day] = acc[day] || [];
      acc[day].push(eventsMapper[key]);
      return acc;
    }, {});
  }, [eventsMapper, month, year]);

  const totalCells = firstDay + lastDate;
  const totalWeeks = Math.ceil(totalCells / 7);

  const weekColorMap = useMemo(() => {
    const weeks = [];

    for (let w = 0; w < totalWeeks; w++) {
      const startIndex = w * 7 - firstDay + 1;
      const endIndex = startIndex + 6;
      let totalEvents = 0;

      for (let i = startIndex; i <= endIndex; i++) {
        if (currentMonthMapper[i]) {
          totalEvents += currentMonthMapper[i].length;
        }
      }

      let bgColor =
        totalEvents > 1
          ? "bg-green-800 text-white"
          : totalEvents === 1
          ? "bg-blue-100 text-gray-700"
          : "bg-white";

      weeks.push(bgColor);
    }

    return weeks;
  }, [currentMonthMapper, firstDay, lastDate]);

  return (
    <div className="grid grid-cols-7 p-2">
      {days.map((day) => (
        <div
          key={day}
          className="justify-center flex border-2 border-gray-300 mb-2 py-4 font-semibold"
        >
          {day}
        </div>
      ))}

      {Array.from({ length: totalWeeks })
        .flatMap((_, weekIndex) => {
          const startIndex = weekIndex * 7;
          const weekDays = [];

          let weekHasHoliday = false;

          for (let i = 0; i < 7; i++) {
            const index = startIndex + i;
            const dayNum = index - firstDay + 1;
            const isInMonth = dayNum > 0 && dayNum <= lastDate;

            if (isInMonth && currentMonthMapper[dayNum]?.length > 0) {
              weekHasHoliday = true;
            }

            weekDays.push({ index, dayNum, isInMonth });
          }

          if (showHolidays && !weekHasHoliday) return [];

          return weekDays;
        })
        .map(({ index, dayNum, isInMonth }) => {
          const weekIndex = Math.floor(index / 7);
          const isToday =
            netToday.getDate() === dayNum &&
            netToday.getMonth() === month &&
            netToday.getFullYear() === year;
          const event = currentMonthMapper[dayNum];

          return (
            <div key={index}>
              <div
                className={`border-2 flex flex-col items-center w-full h-28 relative ${
                  isInMonth ? weekColorMap[weekIndex] : "bg-gray-100"
                }`}
              >
                {isToday && isInMonth && (
                  <div className="absolute top-1 right-1">
                    <div className="rounded-full bg-green-800 w-3 h-3"></div>
                  </div>
                )}
                <div className="flex items-center justify-center h-5 mt-1 text-sm font-medium">
                  <span
                    className={
                      weekColorMap[weekIndex].includes("green-800")
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    {isInMonth ? dayNum : ""}
                  </span>
                </div>
                {isInMonth &&
                  showHolidays &&
                  event?.map((e, i) => (
                    <div
                      key={i}
                      className="mt-1 px-1 py-1 text-xs bg-green-200 rounded shadow text-center w-full"
                    >
                      {e.title}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export const EventCalendar = ({ events }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showHolidays, setShowHolidays] = useState(true);

  const eventsMapper = useMemo(() => {
    return events.reduce((acc, event) => {
      const dateKey = format(new Date(event.date), "yyyy-MM-dd");
      acc[dateKey] = event;
      return acc;
    }, {});
  }, [events]);

  const prevMonth = () => {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex gap-x-4 items-center justify-center mb-4">
        <button onClick={prevMonth}>
          <FaBackward />
        </button>
        <div className="text-lg font-bold text-center">Vacation Calendar</div>
        <button onClick={nextMonth}>
          <FaForward />
        </button>
        <div className="ml-4 font-semibold">
          {month + 1}/{year}
        </div>
        <button
          className="ml-4 px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setShowHolidays((prev) => !prev)}
        >
          {showHolidays ? "Hide Holidays" : "Show Holidays"}
        </button>
      </div>
      <MonthWiseCalendar
        eventsMapper={ eventsMapper}
        month={month}
        year={year}
        showHolidays={showHolidays}
      />
    </div>
  );
};
