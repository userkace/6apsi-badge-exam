import React, { forwardRef } from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = forwardRef((props, ref) => {
    const { open, onClose, message, severity = 'info' } = props;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ marginBottom: 2, marginRight: 2 }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
});

export default CustomSnackbar;
