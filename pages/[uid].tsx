import React from 'react';

import { GetServerSideProps } from 'next';

interface UserIdProps {
  uid: string;
}

const UserId: React.FC<UserIdProps> = (props) => {
  return <div>User With ID: {props.uid}</div>;
};

export const getServerSideProps: GetServerSideProps<UserIdProps> = async (context) => {
  const { params } = context;
  const emptyRes = { props: { uid: "" } };

  if (!params) return emptyRes;

  const uid = params.uid;

  if (typeof uid !== "string") return emptyRes;

  return {
    props: {
      uid: uid
    }
  };
};

export default UserId;
