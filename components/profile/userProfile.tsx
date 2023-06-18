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

  const passwordChangeHandler = async ({
    oldPassword,
    newPassword
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const result = await fetch("/api/users/change-password", {
      method: "PATCH",
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await result.json();
    console.log(data);
  };

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onPasswordChange={passwordChangeHandler} />
    </section>
  );
};

export default UserProfile;
