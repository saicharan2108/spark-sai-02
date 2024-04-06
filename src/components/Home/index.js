import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Home = () => {
  const [userMessage, setUserMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
   const prompt =  `Based on Following entry, generate list of questions and send them in json format so we can handle -
    ${userMessage}`
    const requestOptions = {

      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'Be precise and concise.' },
          { role: 'user', content: prompt }
        ]
      })
    };

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', requestOptions);
      const data = await response.json();
      generateQuestions(data);
    } catch (error) {
      console.error('Error fetching completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = (response) => {

    // Assuming response.choices[0]["message"]["content"] contains the completion
    const generatedQuestions = extractQuestionsFromJson(response.choices[0]["message"]["content"]);
    setQuestions(generatedQuestions);
  };

  const extractQuestionsFromJson = (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      return data.questions || [];
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgb(13, 15, 124)', color: 'white', padding: '20px' }}>
        <TextField
          multiline
          rows={5}
          variant="filled"
          InputProps={{
            sx: {
              border: '1px solid lightgray',
              borderRadius: 4,
              padding: '15px',
              outline: 'none',
              color: 'white'
            }
          }}
          fullWidth
          sx={{ mb: 2 }}
          onChange={handleInputChange}
          value={userMessage}
          placeholder="Enter your message"
        />
        <Button
          variant="contained"
          disabled={isLoading || userMessage.trim() === ''}
          sx={{ mb: 2, backgroundColor: 'rgb(205, 151, 2)', color: 'white' }}
          onClick={handleSubmit}
        >
          {isLoading ? "Generating..." : "Submit"}
        </Button>
      </Box>

      <Box sx={{ width: '70%', padding: '30px', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {questions.map((question, index) => (
            <Grid item key={index} xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    {question}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
