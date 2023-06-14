import classes from './eventSummary.module.css';

interface EventSummaryInfo {
  title: string;
}

const EventSummary: React.FC<EventSummaryInfo> = (props) => {
  const { title } = props;

  return (
    <section className={classes.summary}>
      <h1>{title}</h1>
    </section>
  );
};

export default EventSummary;
