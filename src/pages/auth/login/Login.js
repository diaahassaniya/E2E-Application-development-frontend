import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import { login } from '../../../services/user';
import '../../../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const navigate = useNavigate();
  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  async function handleSubmit(event) {
    const data = { email, password };
    event.preventDefault();
    await login(data)
      .then((res) => {
        localStorage.setItem('role', res.data.role);
        if (res && res.status === 200) navigate('/main');
      })
      .catch((err) => {
        setOpen(true);
        setAlertContent(err.response.data.message);
      });
  }

  return (
    <div className='Login'>
      <Form onSubmit={handleSubmit}>
        <Form.Group size='lg' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="on"
          />
        </Form.Group>
        <Form.Group size='lg' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"

          />
        </Form.Group>
        <Button size='lg' type='submit' disabled={!validateForm()}>
          Login
        </Button>
        <Form.Label>
          you dont have a user regsiter  {' '}   
          <Link to='/register'>now</Link>
        </Form.Label>
      </Form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
