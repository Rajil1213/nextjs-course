import React from 'react';

import { GetServerSideProps } from 'next';

interface UserProfileProps {
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  return <h1>{props.username}</h1>;
};

export const getServerSideProps: GetServerSideProps<UserProfileProps> = async () => {
  return {
    props: {
      username: "Rajil"
    }
  };
};

export default UserProfile;
