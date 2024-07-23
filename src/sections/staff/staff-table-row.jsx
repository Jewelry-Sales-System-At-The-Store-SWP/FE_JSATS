import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Iconify from 'src/components/iconify';
import StaffEditForm from './staff-edit-modal';
import StaffDeleteForm from './staff-del-modal';

export default function UserTableRow({
  userId,
  userName,
  email,
  selected,
  roleName,
  counterNumber,
  handleClick,
  getStaff, // Add getStaff prop
}) {
  const [open, setOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
    handleCloseMenu();
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleCloseMenu();
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    handleCloseMenu();
  };

  const onSubmit = async (updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:5188/api/User/UpdateUser/${userId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200) {
        
        getStaff(); // Refresh data after successful edit
      } else {
        toast.error('Failed to update staff');
      }
      handleEditClose();
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Error updating staff');
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5188/api/User/DeleteUser/${userId}`
      );
      if (res.status === 200) {
       
        getStaff(); // Refresh data after successful delete
      } else {
        toast.error('Failed to delete staff');
      }
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Error deleting staff');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>{userName}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{roleName}</TableCell>
        <TableCell>{counterNumber}</TableCell>
        <TableCell align="right">
          <Button variant="outlined" onClick={handleDialogOpen}>
            More Info
          </Button>
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Staff</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">User ID:</Typography>
              <Typography>{userId}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Username:</Typography>
              <Typography>{userName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Email:</Typography>
              <Typography>{email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Role Name:</Typography>
              <Typography>{roleName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Counter Number:</Typography>
              <Typography>{counterNumber}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEditOpen}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <StaffEditForm
        open={editOpen}
        onClose={handleEditClose}
        staff={{ userId, username: userName, email, roleName, counterNumber }}
        onSubmit={onSubmit}
      />

      <StaffDeleteForm
        open={deleteOpen}
        onClose={handleDeleteClose}
        onDelete={onDelete}
        staff={{ userId, username: userName, email, roleName, counterNumber }}
      />
    </>
  );
}

UserTableRow.propTypes = {
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  roleName: PropTypes.string.isRequired,
  counterNumber: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  getStaff: PropTypes.func.isRequired, 
};


