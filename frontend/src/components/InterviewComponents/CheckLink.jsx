import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CheckLink = () => {
  const { DB_name } = useParams();
  const current_page_link = window.location.href;
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  const checkLinkStatus = async () => {
    try {
      const id = current_page_link.split('/interview/')[1].split('/')[0];
      const response = await axios.post(`http://localhost:5000/api/students/check-link-status/${DB_name}/${id}`);
      console.log(response);
      if (response.data.status === 'ACTIVE') {
        navigate('/login-interviewee',{state:{DB_name,id}});
      } else {
        setStatus(response.data.status); // Set the status for conditional rendering
      }
    } catch (err) {
        setStatus(err.response.data.status);
      console.error(err);
    }
  };
  useEffect(() => {
    checkLinkStatus();
  }, []);
  // Conditional rendering based on the status
  if (status === 'EXPIRED') {
    return <div>LINK EXPIRED .....</div>;
  } else if (status === 'LOCKED') {
    return <div>LINK IS LOCKED. SOMEONE IS GIVING INTERVIEW. CAN'T ACCESS NOW .....</div>;
  } else if (status === 'USED') {
    return <div>LINK USED .....</div>;
  }
  else if(status==='NOT-FOUND'){
    return <div>
        STUDENT DOESN'T EXIST OR LINK BROKEN ....
    </div>
  }
  return (
    <div>
      {/* Show a loading message until the status is determined */}
      {status === null ? 'Checking link status...' : 'Unknown status'}
    </div>
  );
};

export default CheckLink;
