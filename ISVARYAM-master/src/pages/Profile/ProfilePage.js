import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import classes from './profilePage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/Loading/Loading';

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    reset,
  } = useForm();

  const { user, updateProfile, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const defaultValues = {
        name: user.name,
        email: user.email,
        address: user.address,
      };
      reset(defaultValues);
    }
  }, [user, reset]);

  const submit = async (data) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await updateProfile(data);
      if (updatedUser) {
        reset({
          name: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
        });
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="My Profile" />
        <h2 className={classes.userName}>{user?.name}</h2>

        <form onSubmit={handleSubmit(submit)} className={classes.profileForm}>
          <div className={classes.formGrid}>
            <Input
              type="text"
              label="Full Name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
              })}
              error={errors.name}
              disabled={isSubmitting}
            />

            <Input
              type="email"
              label="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email}
              disabled
            />

            <Input
              type="text"
              label="Address"
              {...register('address', {
                required: 'Address is required',
                minLength: {
                  value: 10,
                  message: 'Address must be at least 10 characters',
                },
              })}
              error={errors.address}
              disabled={isSubmitting}
            />
          </div>

          <div className={classes.buttonGroup}>
            <Button
              type="submit"
              text={isSubmitting ? 'Updating...' : 'Update Profile'}
              backgroundColor="#009e84"
              disabled={!isDirty || isSubmitting}
            />
          </div>
        </form>

        <ChangePassword />
      </div>
    </div>
  );
}