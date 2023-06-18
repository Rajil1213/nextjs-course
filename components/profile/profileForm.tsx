import { useRef } from "react";

import classes from "./profileForm.module.css";

interface ProfileFormProps {
  onPasswordChange: (pwUpdateDoc: { oldPassword: string; newPassword: string }) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = (props) => {
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const passwordChangeHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const oldPassword = oldPasswordRef.current?.value;
    const newPassword = newPasswordRef.current?.value;

    if (!oldPassword || !newPassword) return;

    props.onPasswordChange({ oldPassword, newPassword });
  };

  return (
    <form className={classes.form} onSubmit={passwordChangeHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordRef} />
      </div>
      <div className={classes.action}>
        <button type="submit">Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
