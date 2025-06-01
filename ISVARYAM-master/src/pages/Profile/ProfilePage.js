import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import classes from './profilePage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import { FaUser, FaMapMarkerAlt, FaUserEdit, FaQuestionCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, updateProfile } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const submit = user => {
    updateProfile(user);
  };

  return (
    <div className={classes.container}>
      {/* Sidebar */}
      <aside className={classes.sidebar}>
        <div className={classes.card}>
          <FaUser size={48} className={classes.avatar} />
          <h3>{user.name}</h3>
          <p><FaMapMarkerAlt size={12} /> {user.address}</p>
        </div>
      </aside>

      {/* Main form */}
      <main className={classes.details}>
        <div className={classes.titleRow}>
          <Title title="Update Profile" />
          <FaUserEdit className={classes.editIcon} />
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <Input
            defaultValue={user.name}
            type="text"
            label="Name"
            {...register('name', { required: true, minLength: 5 })}
            error={errors.name}
          />
          <Input
            defaultValue={user.address}
            type="text"
            label="Address"
            {...register('address', { required: true, minLength: 10 })}
            error={errors.address}
          />
          <Button type="submit" text="Save Changes" size="small" backgroundColor="#009e84" />
        </form>

        {/* Change Password Trigger Button */}
        <button
          type="button"
          className={classes.changePasswordBtn}
          onClick={() => setShowPasswordDialog(true)}
        >
          <FaQuestionCircle /> Change Password?
        </button>

        {/* Password Dialog */}
        {showPasswordDialog && (
          <div className={classes.dialogOverlay}>
            <div className={classes.dialogBox}>
              <div className={classes.dialogHeader}>
                <h3></h3>
                <button onClick={() => setShowPasswordDialog(false)}>&times;</button>
              </div>
              <ChangePassword />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
