/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField, Alert, Card, CardContent, IconButton } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Tips() {
  const { id: milestoneId } = useParams();
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/milestones/${milestoneId}/tips`);
      setTips(res.data);
    } catch (_) {
      setError('Failed to load tips');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTips();
    // eslint-disable-next-line
  }, [milestoneId]);

  const handleAddTip = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await axios.post(`/api/milestones/${milestoneId}/tips`, { content });
      setContent('');
      fetchTips();
    } catch (_) {
      setError('Failed to add tip');
    }
    setAdding(false);
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton aria-label="Back to milestones" onClick={() => navigate('/milestones')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={1}>Community Tips</Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleAddTip} style={{ marginBottom: 24 }}>
        <TextField
          label="Share a tip for this milestone"
          value={content}
          onChange={e => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          required
          aria-label="Tip content"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={adding} aria-label="Add Tip">
          Add Tip
        </Button>
      </form>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {tips.map(tip => (
            <Card key={tip._id} variant="outlined" tabIndex={0} aria-label={`Tip by ${tip.userId?.name || 'Anonymous'}`}> 
              <CardContent>
                <Typography variant="body1">{tip.content}</Typography>
                {tip.userId?.name && <Typography variant="caption" color="text.secondary">By: {tip.userId.name}</Typography>}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
} 