import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

import './App.css'
import axios from 'axios';
import { FormControl } from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("https://email-writer-wjkc.onrender.com/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }catch (error) {
      setError('Failed to generate reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
     }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>    
    <Container maxWidth = "md" sx={{py:4,flex:1}}>
      <Typography variant="h3" component="h1" gutterBottom sx={{
  fontWeight: 800,
  color: "#000"
}}
>
        Email Reply Generator
      </Typography>
      <Paper elevation={6} 
        sx={{p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)"
        }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{mb:2}}/> 
          <FormControl fullWidth sx={{mb:2}}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
              sx={{mb:2, width: 200}}>
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="Formal">Formal</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Informal">Informal</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
            </Select>
          </FormControl>

          <Button
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: "16px",
              borderRadius: 2,
              background: "linear-gradient(90deg, #2196f3, #21cbf3)",
              color: "white","&:hover": {
                background: "linear-gradient(90deg, #1976d2, #0288d1)"
              }
            }}>
            {loading ? <CircularProgress size={24} sx={{color:"white"}}/> : 'Generate Reply'}
          </Button>
      </Paper>    
        {error && (
          <Typography color="error" sx={{mt:2}}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{mt: 4,p: 3,backgroundColor: "white",borderRadius: 3,boxShadow: 3}}>
            <Typography variant="h6" gutterBottom>
              Generated Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={generatedReply || ''}
              inputProps={{ readOnly: true }}/>
            
            <Button
              variant='outlined'
              sx={{mt:2}}
              onClick={() => navigator.clipboard.writeText(generatedReply)}>
                Copy to Clipboard
            </Button>
          </Box>   
        )}
    </Container>
    <Box
  component="footer"
  sx={{
    textAlign: "center",
    py: 2,
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #ddd"
  }}
>
  <Typography variant="body2" color="text.secondary">
    © {new Date().getFullYear()} Email Reply Generator | Developed by <strong>Piyush Kumar</strong>
  </Typography>
</Box>

        
    </div>
  )
}

export default App
