import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../staff-table-row';
import UserTableHead from '../staff-table-head';
import TableEmptyRows from '../table-empty-rows';
import StaffForm from '../create-staff-table';
import UserTableToolbar from '../staff-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function StaffView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStaff, setCurrentStaff] = useState(null);

  // Get JWT token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:5188/api/User/GetUsers', {
          headers: { Authorization: `Bearer ${token}` } // Add token to header
        });
        const filteredStaff = response.data.filter(user => user.roleName === 'Staff');
        setStaff(filteredStaff);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast.error(`Error fetching staff data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [token]);

  const getStaff = async () => {
    try {
      const res = await axios.get('http://localhost:5188/api/User/GetUsers', {
        headers: { Authorization: `Bearer ${token}` } // Add token to header
      });
      const filteredStaff = res.data.filter(user => user.roleName === 'Staff');
      setStaff(filteredStaff);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.error(`Error fetching staff data: ${error.message}`);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(staff.map(n => n.username));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, username) => {
    const selectedIndex = selected.indexOf(username);
    const newSelected = selectedIndex === -1
      ? [...selected, username]
      : selected.filter((_, index) => index !== selectedIndex);

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleNewStaffClick = async (newStaffData) => {
    try {
      const response = await axios.post('http://localhost:5188/api/User/AddUser', newStaffData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Add token to header
        },
      });

      if (response.status === 200) {
        toast.success('Staff added successfully');
        getStaff();
        setShowStaffForm(false);
      } else {
        toast.error('Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Error adding staff');
    }
  };



  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selected.map(async (username) => {
          const staffMember = staff.find(member => member.username === username);
          if (staffMember) {
            const response = await axios.delete(`http://localhost:5188/api/User/DeleteUser/${staffMember.userId}`, {
              headers: { Authorization: `Bearer ${token}` } // Add token to header
            });
            if (response.status !== 200) {
              throw new Error(`Failed to delete staff with username: ${username}`);
            }
          }
        })
      );
      toast.success('Selected staff deleted successfully');
      getStaff();
      setSelected([]);
    } catch (error) {
      console.error('Error deleting selected staff:', error);
      toast.error('Error deleting selected staff');
    }
  };

  const dataFiltered = applyFilter({
    inputData: staff,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Staff</Typography>
        <Button
          onClick={() => {
            setCurrentStaff(null); // Clear any existing staff data
            setShowStaffForm(true);
          }}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Staff
        </Button>
      </Stack>

      <StaffForm
        open={showStaffForm}
        onClose={() => {
          setShowStaffForm(false);
          setCurrentStaff(null);
        }}
        onSubmit={currentStaff ? handleUpdateStaff : handleNewStaffClick}
        staff={currentStaff}
      />

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={staff.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'email', label: 'Email' },
                  { id: 'roleName', label: 'Role' },
                  { id: 'counterNumber', label: 'Counter Number' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <UserTableRow
                      key={row.userId}
                      userId={row.userId}
                      userName={row.username}
                      email={row.email}
                      roleName={row.roleName}
                      counterNumber={row.counterNumber}
                      selected={selected.includes(row.username)}
                      handleClick={(event) => handleClick(event, row.username)}
                      getStaff={getStaff}
                      onEdit={() => {
                        setCurrentStaff(row);
                        setShowStaffForm(true);
                      }} // Handle edit click
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, staff.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={staff.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
