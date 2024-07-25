import React from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';

function StaffEditForm({ open, onClose, onSubmit, staff }) {
  const [formState, setFormState] = React.useState({
    roleId: staff ? staff.roleId : '',
    username: staff ? staff.username : '',
    fullName: staff ? staff.fullName : '',
    gender: staff ? staff.gender : '',
    email: staff ? staff.email : '',
    status: true, // Default to true
  });

  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (staff) {
      setFormState({
        roleId: staff.roleId,
        username: staff.username,
        fullName: staff.fullName,
        gender: staff.gender,
        email: staff.email,
        status: staff.status ?? true,
      });
    }
  }, [staff]);

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.roleId) newErrors.roleId = 'Role is required';
    if (!formState.username) newErrors.username = 'Username is required';
    if (!formState.fullName) newErrors.fullName = 'Full Name is required';
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formState.gender) newErrors.gender = 'Gender is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      onSubmit(formState);
      onClose();
    } else {
      toast.error('Please fix the validation errors');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Staff</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="username"
          label="User Name"
          type="text"
          fullWidth
          onChange={handleChange}
          value={formState.username}
          error={!!errors.username}
          helperText={errors.username}
          InputProps={{ style: { marginBottom: 10 } }}
        />

        <TextField
          margin="dense"
          name="fullName"
          label="Full Name"
          type="text"
          fullWidth
          onChange={handleChange}
          value={formState.fullName}
          error={!!errors.fullName}
          helperText={errors.fullName}
          InputProps={{ style: { marginBottom: 10 } }}
        />

        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          onChange={handleChange}
          value={formState.email}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{ style: { marginBottom: 10 } }}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="roleId"
            label="Role"
            value={formState.roleId}
            onChange={handleChange}
            error={!!errors.roleId}
          >
            <MenuItem value="2">Manager</MenuItem>
            <MenuItem value="3">Staff</MenuItem>
          </Select>
          {errors.roleId && <p style={{ color: 'red', margin: '5px 0' }}>{errors.roleId}</p>}
        </FormControl>

        <TextField
          margin="dense"
          name="gender"
          label="Gender"
          type="text"
          fullWidth
          onChange={handleChange}
          value={formState.gender}
          error={!!errors.gender}
          helperText={errors.gender}
          InputProps={{ style: { marginBottom: 10 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

StaffEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  staff: PropTypes.shape({
    roleId: PropTypes.string,
    username: PropTypes.string,
    fullName: PropTypes.string,
    gender: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.bool,
  }),
};

export default StaffEditForm;








