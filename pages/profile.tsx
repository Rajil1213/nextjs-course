import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import UserProfile from "../components/profile/userProfile";

function ProfilePage() {
  return <UserProfile />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false // only this time
      }
    };
  }

  return { props: { session } }; // used in the session provider
};

export default ProfilePage;
