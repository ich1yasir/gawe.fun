import React from 'react';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';

export default function NotificationSnackBar() {
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant) => () => {
        enqueueSnackbar('This is a success message!', { variant });
    };
    // variant could be success, error, warning, info, or default
  return (
    <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
  );
}