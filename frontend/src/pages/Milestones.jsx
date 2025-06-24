/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Card, CardContent, CardActions, Divider } from '@mui/material';
import { Add, Edit, Delete, Dashboard } from '@mui/icons-material';
import { LightbulbOutlined as TipsIcon } from "@mui/icons-material";



import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editMilestone, setEditMilestone] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', notes: '' });
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/milestones');
      setMilestones(res.data);
    } catch (_) {
      setError('Failed to load milestones');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleOpen = (milestone = null) => {
    setEditMilestone(milestone);
    setForm(milestone ? {
      title: milestone.title,
      date: milestone.date.slice(0, 10),
      notes: milestone.notes || ''
    } : { title: '', date: '', notes: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMilestone(null);
    setForm({ title: '', date: '', notes: '' });
    setError('');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editMilestone) {
        await axios.put(`/api/milestones/${editMilestone._id}`, form);
      } else {
        await axios.post('/api/milestones', form);
      }
      fetchMilestones();
      handleClose();
    } catch (_) {
      setError('Failed to save milestone');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this milestone?')) return;
    try {
      await axios.delete(`/api/milestones/${id}`);
      fetchMilestones();
    } catch (_) {
      setError('Failed to delete milestone');
    }
  };

  return (
    <Box maxWidth={700}  mx="auto" mt={4}>
      <Typography variant="h4" mb={2}>Your Milestones</Typography>
      {user && (
        <Typography variant="h6" color="secondary" mb={2}>
          Welcome, {user.name}! {user.week ? `You're in week ${user.week}.` : ''}
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Dashboard />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2, mr: 2 }}
        aria-label="Go to Dashboard"
      >
        Dashboard
      </Button>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }} aria-label="Add New Milestone">
        Add New Milestone
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {milestones.map(m => (
            <Card key={m._id} variant="outlined" tabIndex={0} aria-label={`Milestone: ${m.title}`}> 
              <CardContent>
                <Typography variant="h6">{m.title}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {m.date.slice(0, 10)}</Typography>
                {m.notes && <Typography variant="body2">Notes: {m.notes}</Typography>}
              </CardContent>
              <Divider />
              <CardActions>
                <Button size="small" onClick={() => handleOpen(m)} aria-label={`Edit ${m.title}`}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(m._id)} aria-label={`Delete ${m.title}`}>Delete</Button>
                <Button size="small" onClick={() => navigate(`/milestones/${m._id}/tips`)} aria-label={`View tips for ${m.title}`}>Community Tips</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMilestone ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 