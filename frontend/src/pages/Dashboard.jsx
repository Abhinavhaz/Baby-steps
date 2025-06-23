import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, LinearProgress, Chip, Divider, TextField, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

const mockRecommendations = [
  'Finalize hospital bag',
  'Install car seat',
  'Stock up on newborn essentials',
  'Rest as much as possible',
];

const mockMilestones = [
  {
    title: 'Heard the heartbeat',
    date: '2024-03-10',
    notes: 'Such an amazing moment! Heart rate was 150 bpm.',
    week: 12,
  },
  {
    title: 'First ultrasound',
    date: '2024-02-28',
    notes: 'Baby is measuring perfectly on track. Due date confirmed!',
    week: 10,
  },
  {
    title: 'First prenatal appointment',
    date: '2024-02-15',
    notes: 'Everything looks great! Got to see the baby for the first time.',
    week: 8,
  },
  {
    title: 'Started prenatal vitamins',
    date: '2024-01-20',
    notes: 'Doctor recommended folic acid and DHA supplements.',
    week: 5,
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState(mockMilestones);
  const [showAlert, setShowAlert] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', notes: '' });

  // Mock progress
  const currentWeek = 40 + 37; // 77 for demo
  const dueDate = '2024-08-15';
  const progress = Math.round((currentWeek / 40) * 100);
  const trimester = currentWeek < 13 ? 'First trimester' : currentWeek < 27 ? 'Second trimester' : 'Third trimester';

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.date) {
      setShowAlert(true);
      return;
    }
    setMilestones([
      { ...newMilestone, week: Math.floor(Math.random() * 40) + 1 },
      ...milestones,
    ]);
    setNewMilestone({ title: '', date: '', notes: '' });
    setShowAlert(false);
  };

  return (
    <Box sx={{ background: '#f9eafc', minHeight: '100vh', py: 4 }}>
      {/* Welcome Section */}
      <Box maxWidth={900} mx="auto" mb={3}>
        <Card sx={{ background: 'linear-gradient(90deg, #fbefff 0%, #f9eafc 100%)', p: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} mb={1}>
              Welcome back, {user?.name || 'Sarah'}! <EmojiEmotionsIcon fontSize="large" sx={{ verticalAlign: 'middle' }} />
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
              <Box>-{currentWeek - 40} weeks to go</Box>
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
              {mockRecommendations.map((rec, idx) => (
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
                  />
                  <TextField
                    label="Date"
                    type="date"
                    value={newMilestone.date}
                    onChange={e => setNewMilestone({ ...newMilestone, date: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  <TextField
                    label="Notes"
                    value={newMilestone.notes}
                    onChange={e => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                    fullWidth
                    margin="normal"
                    multiline
                    minRows={2}
                  />
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Add Milestone</Button>
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
        <Typography variant="h5" fontWeight={700} mb={2}>Your Milestone Timeline</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {milestones.map((m, idx) => (
            <Card key={idx} sx={{ background: '#fff', borderLeft: '6px solid #e1bee7' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <FavoriteIcon color="secondary" />
                  <Typography variant="h6">{m.title}</Typography>
                  <Chip label={`Week ${m.week}`} color={idx % 2 === 0 ? 'secondary' : 'success'} size="small" sx={{ ml: 2 }} />
                </Box>
                <Typography color="text.secondary" mb={1}>{new Date(m.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                <Typography>{m.notes}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Tips & Advice */}
      <Box maxWidth={900} mx="auto" mb={3}>
        <Typography variant="h5" fontWeight={700} mb={2}>Tips & Advice</Typography>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} color="text.secondary" justifyContent="center" py={4}>
              <LightbulbOutlinedIcon fontSize="large" />
              <Box>
                <Typography>No tips available for your current week.</Typography>
                <Typography variant="body2">Check back later for more community wisdom!</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 