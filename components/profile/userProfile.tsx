import ProfileForm from "./profileForm";
import classes from "./userProfile.module.css";

const UserProfile: React.FC = () => {
  // Redirect away if NOT auth

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
