import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Timeline: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new TeamTimeline page
    navigate('/team-timeline');
  }, [navigate]);

  return null; // This component will redirect immediately
};