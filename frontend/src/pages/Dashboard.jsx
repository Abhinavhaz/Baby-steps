import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, LinearProgress, TextField, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

// Dynamic recommendations based on pregnancy week
const getRecommendationsForWeek = (week) => {
  if (week <= 12) {
    return [
      'Take prenatal vitamins daily',
      'Schedule first prenatal appointment',
      'Avoid alcohol and smoking',
      'Get plenty of rest'
    ];
  } else if (week <= 20) {
    return [
      'Schedule anatomy scan',
      'Start thinking about baby names',
      'Consider prenatal classes',
      'Maintain healthy diet'
    ];
  } else if (week <= 28) {
    return [
      'Start planning nursery',
      'Consider baby registry',
      'Monitor baby movements',
      'Stay hydrated'
    ];
  } else if (week <= 36) {
    return [
      'Pack hospital bag',
      'Install car seat',
      'Finalize birth plan',
      'Stock up on baby essentials'
    ];
  } else {
    return [
      'Rest as much as possible',
      'Monitor contractions',
      'Have hospital bag ready',
      'Stay close to hospital'
    ];
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  // Calculate dynamic progress based on user data or milestones
  const calculateCurrentWeek = () => {
    if (user?.dueDate) {
      const due = new Date(user.dueDate);
      const now = new Date();
      const diffTime = due.getTime() - now.getTime();
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.max(1, Math.min(40, 40 - diffWeeks));
    }

    // Fallback: estimate based on milestones if available
    if (milestones.length > 0) {
      const oldestMilestone = milestones.reduce((oldest, current) =>
        new Date(current.date) < new Date(oldest.date) ? current : oldest
      );
      const weeksSinceFirst = Math.floor((new Date() - new Date(oldestMilestone.date)) / (1000 * 60 * 60 * 24 * 7));
      return Math.min(40, Math.max(1, weeksSinceFirst + 8)); // Assume first milestone was around week 8
    }

    return 20; // Default fallback
  };

  const currentWeek = calculateCurrentWeek();
  const progress = Math.round((currentWeek / 40) * 100);
  const trimester = currentWeek <= 12 ? 'First trimester' : currentWeek <= 27 ? 'Second trimester' : 'Third trimester';
  const dueDate = user?.dueDate || new Date(Date.now() + (40 - currentWeek) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const recommendations = getRecommendationsForWeek(currentWeek);

  // Fetch milestones from API
  const fetchMilestones = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/milestones');
      setMilestones(res.data);
    } catch (err) {
      setError('Failed to load milestones');
      console.error('Error fetching milestones:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.date) {
      setShowAlert(true);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post('/api/milestones', newMilestone);
      setMilestones([res.data, ...milestones]);
      setNewMilestone({ title: '', date: '', notes: '' });
      setShowAlert(false);
    } catch (err) {
      setError('Failed to save milestone');
      console.error('Error creating milestone:', err);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: '#f9eafc', minHeight: '100vh', py: 4 }}>
      {/* Welcome Section */}
      <Box maxWidth={900} mx="auto" mb={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Card sx={{ background: 'linear-gradient(90deg, #fbefff 0%, #f9eafc 100%)', p: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} mb={1}>
              Welcome back, {user?.name || 'Mom-to-be'}! <EmojiEmotionsIcon fontSize="large" sx={{ verticalAlign: 'middle' }} />
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Track your pregnancy journey and celebrate every milestone
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <FavoriteIcon color="secondary" />
              <Typography fontWeight={600} fontSize={20}>Week {currentWeek} of 40</Typography>
              <Typography color="text.secondary">You're {progress}% through your pregnancy journey</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 1, background: '#f3d6f7' }} />
            <Box display="flex" alignItems="center" justifyContent="space-between" color="text.secondary">
              <Box display="flex" alignItems="center" gap={1}><CalendarTodayIcon fontSize="small" /> Due: {dueDate}</Box>
              <Box>{40 - currentWeek} weeks to go</Box>
              <Box>{trimester}</Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recommendations */}
      <Box maxWidth={900} mx="auto" mb={3}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={1}>This Week's Recommendations</Typography>
            <Typography color="text.secondary" mb={2}>Personalized tips for week {currentWeek}</Typography>
            <Grid container spacing={2}>
              {recommendations.map((rec, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box sx={{ background: '#f3f7fd', borderRadius: 2, p: 2, textAlign: 'center', fontWeight: 500 }}>
                    {rec}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Add Milestone & Progress */}
      <Box maxWidth={900} mx="auto" mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1}>Add New Milestone</Typography>
                <Typography color="text.secondary" mb={2}>Record a special moment in your pregnancy journey</Typography>
                {showAlert && <Alert severity="error" sx={{ mb: 2 }}>Title and date are required.</Alert>}
                <form onSubmit={handleAddMilestone}>
                  <TextField
                    label="Title"
                    value={newMilestone.title}
                    onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    fullWidth
                    margin="normal"
                    required
                    disabled={submitting}
                  />
                  <TextField
                    label="Date"
                    type="date"
                    value={newMilestone.date}
                    onChange={e => setNewMilestone({ ...newMilestone, date: e.target.value })}
                    fullWidth
                    margin="normal"
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                    disabled={submitting}
                  />
                  <TextField
                    label="Notes"
                    value={newMilestone.notes}
                    onChange={e => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                    fullWidth
                    margin="normal"
                    multiline
                    minRows={2}
                    disabled={submitting}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Add Milestone'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1}>Your Progress</Typography>
                <Typography color="text.secondary" mb={2}>{milestones.length} milestones recorded so far</Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" justifyContent="space-between"><span>Milestones</span><span>{milestones.length}</span></Box>
                  <Box display="flex" justifyContent="space-between"><span>Current Week</span><span>{currentWeek}</span></Box>
                  <Box display="flex" justifyContent="space-between"><span>Progress</span><span>{progress}%</span></Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Milestone Timeline */}
      <Box maxWidth={900} mx="auto" mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>Your Milestone Timeline</Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/milestones')}
            sx={{ ml: 2 }}
          >
            View All Milestones
          </Button>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          {milestones.length === 0 ? (
            <Card sx={{ background: '#fff', textAlign: 'center', py: 4 }}>
              <CardContent>
                <Typography color="text.secondary" mb={2}>
                  No milestones recorded yet. Add your first milestone above!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/milestones')}
                >
                  Go to Milestones Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            milestones.slice(0, 3).map((m, idx) => (
              <Card key={m._id || idx} sx={{ background: '#fff', borderLeft: '6px solid #e1bee7' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <FavoriteIcon color="secondary" />
                    <Typography variant="h6">{m.title}</Typography>
                  </Box>
                  <Typography color="text.secondary" mb={1}>
                    {new Date(m.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  {m.notes && <Typography>{m.notes}</Typography>}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* Tips & Advice */}
      <Box maxWidth={900} mx="auto" mb={3}>
        <Typography variant="h5" fontWeight={700} mb={2}>Tips & Advice</Typography>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} color="text.secondary" justifyContent="center" py={4}>
              <LightbulbOutlinedIcon fontSize="large" />
              <Box textAlign="center">
                <Typography mb={1}>
                  {milestones.length > 0
                    ? "Visit your milestones to see community tips and share your own experiences!"
                    : "Add some milestones to unlock community tips and advice!"
                  }
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/milestones')}
                  sx={{ mt: 1 }}
                >
                  {milestones.length > 0 ? "View Milestone Tips" : "Add Your First Milestone"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 