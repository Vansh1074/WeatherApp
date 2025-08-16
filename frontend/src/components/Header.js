import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const handleInfoClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                >
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Weather App
                </Typography>
                <Button
                variant="contained"
                color="info"
                startIcon={<FontAwesomeIcon icon={faInfo} />}
                onClick={handleInfoClick}
                >
                Info
                </Button>
            </Toolbar>
        </AppBar>
        <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                <h1>PM Accelerator</h1>
                The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.
                <br /><br />
                Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.
                <br /><br />
                Here are the examples of services we offer. Check out our website (link under my profile) to learn more about our services.
                <br />
                🚀 PMA Pro <br />
                End-to-end product manager job hunting program that helps you master FAANG-level Product Management skills, conduct unlimited mock interviews, and gain job referrals through our largest alumni network. 25% of our offers came from tier 1 companies and get paid as high as $800K/year. 
                <br /><br />
                🚀 AI PM Bootcamp <br />
                Gain hands-on AI Product Management skills by building a real-life AI product with a team of AI Engineers, data scientists, and designers. We will also help you launch your product with real user engagement using our 100,000+ PM community and social media channels. 
                <br /><br />
                🚀 PMA Power Skills <br />
                Designed for existing product managers to sharpen their product management skills, leadership skills, and executive presentation skills
                <br /><br />
                🚀 PMA Leader <br />
                We help you accelerate your product management career, get promoted to Director and product executive levels, and win in the board room. 
                <br /><br />
                🚀 1:1 Resume Review <br />
                We help you rewrite your killer product manager resume to stand out from the crowd, with an interview guarantee.Get started by using our FREE killer PM resume template used by over 14,000 product managers. https://www.drnancyli.com/pmresume
                <br /><br />
                🚀 We also published over 500+ free training and courses. Please go to my YouTube channel https://www.youtube.com/c/drnancyli and Instagram @drnancyli to start learning for free today.
                <br /><br />
                Website : https://www.pmaccelerator.io/ 
                <br />
                Phone : +19548891063
            </Alert>
      </Snackbar>
    </Box>
  );
}
