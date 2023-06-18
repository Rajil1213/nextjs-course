import ProfileForm from "./profileForm";
import classes from "./userProfile.module.css";

const UserProfile: React.FC = () => {
  // // Redirect away if NOT auth
  // const { data, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!data && status !== "loading") {
  //     router.push("/auth");
  //   }
  // }, [data, status, router]);

  // if (status === "loading") {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
