import classes from './eventContent.module.css';

const EventContent: React.FC<React.PropsWithChildren> = (props) => {
  return <section className={classes.content}>{props.children}</section>;
};

export default EventContent;
