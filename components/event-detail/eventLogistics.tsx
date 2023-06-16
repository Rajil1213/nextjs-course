/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import AddressIcon from "../icons/addressIcon";
import DateIcon from "../icons/dateIcon";
import classes from "./eventLogistics.module.css";
import LogisticsItem from "./logisticsItem";

interface EventLogisticsInfo {
  date: string;
  address: string;
  image: string;
  imageAlt: string;
}

const EventLogistics: React.FC<EventLogisticsInfo> = (props) => {
  const { date, address, image, imageAlt } = props;

  const humanReadableDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const addressText = address.replace(", ", "\n");

  return (
    <section className={classes.logistics}>
      <div className={classes.image}>
        <Image src={`/${image}`} alt={imageAlt} width={500} height={500} />
      </div>
      <ul className={classes.list}>
        <LogisticsItem icon={DateIcon}>
          <time>{humanReadableDate}</time>
        </LogisticsItem>
        <LogisticsItem icon={AddressIcon}>
          <address>{addressText}</address>
        </LogisticsItem>
      </ul>
    </section>
  );
};

export default EventLogistics;
