import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNumber: ''
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when the component loads
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/users/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Token from localStorage
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.result);  // Populate user details
        } else {
          setErrorMessage(data.message || 'Failed to fetch user data.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array to run only once when component mounts

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    const payload = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await fetch('http://localhost:4000/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // JWT token for authentication
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.message || 'Failed to update password.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the password.');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h3>User Profile</h3>
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Middle Name:</strong> {user.middleName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone Number:</strong> {user.contactNumber}</p>

              <h4 className="mt-4">Change Password</h4>
              <Form onSubmit={handleChangePassword}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form.Group controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
