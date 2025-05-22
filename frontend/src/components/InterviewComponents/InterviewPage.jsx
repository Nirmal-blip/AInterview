import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import axios from 'axios';

const InterviewPage = () => {
    const { uniqueID, DB_name } = useParams();
    console.log(uniqueID, DB_name);
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        markAsVisited();

        // Handle tab close to set the link status to "USED"
        const handleTabClose = async () => {
            try {
              await socket.emit('tabClosed', { uniqueID, DB_name });
                await axios.put(`http://localhost:5000/api/students/update-link-status/${DB_name}`, {
                    status: 'USED',
                    link: `http://localhost:5173/interview/${uniqueID}/${DB_name}`
                }, { withCredentials: true });
            } catch (err) {
                console.log('Error updating link status on tab close:', err);
            }
        };

        window.addEventListener('unload', handleTabClose);

        return () => {
            window.removeEventListener('unload', handleTabClose);

        };
    }, [socket, uniqueID, DB_name]);

    const markAsVisited = async () => {
        try {
            await socket.emit('markAsVisited', uniqueID);
        } catch (err) {
            console.log(err);
        }
    };

    const markEndInterview = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/students/update-link-status/${DB_name}`,
                {
                    status: 'EXPIRED',
                    link: `http://localhost:5173/interview/${uniqueID}/${DB_name}`
                },
                { withCredentials: true }
            );
            if (response.status === 200) {
                localStorage.setItem('company-interviewee', JSON.stringify(null));
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            Welcome
            <button
                onClick={() => {
                    markEndInterview();
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
            >
                END INTERVIEW
            </button>
        </div>
    );
};

export default InterviewPage;
