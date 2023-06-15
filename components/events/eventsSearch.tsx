import React, { useRef } from "react";

import Button from "../ui/button";
import classes from "./eventsSearch.module.css";

interface EventsSearchProps {
  onSearch: (year: string, month: string) => void;
}

const EventsSearch: React.FC<EventsSearchProps> = ({ onSearch }) => {
  const yearRef = useRef<HTMLSelectElement>(null);
  const monthRef = useRef<HTMLSelectElement>(null);

  const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const year = yearRef.current?.value;
    const month = monthRef.current?.value;

    if (!year || !month) {
      console.log("could not get month and year, returning...");
      console.log(`year= ${year}, month= ${month}`);
      return;
    }

    onSearch(year, month);
  };

  return (
    <form className={classes.form}>
      <div className={classes.controls}>
        <div className={classes.control}>
          <label htmlFor="year">Year</label>
          <select name="year" id="year" ref={yearRef}>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <div className={classes.control}>
          <label htmlFor="month">Month</label>
          <select name="month" id="month" ref={monthRef}>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>
      <Button onClick={submitHandler}>Filter Events</Button>
    </form>
  );
};

export default EventsSearch;
