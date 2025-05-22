import { useState } from 'react';
import {
  Container, Button, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Box, LinearProgress, Alert,
  IconButton, Slide, Fade
} from '@mui/material';
import { CloudUpload, CheckCircle, Send, Error, HighlightOff } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import styled from "@emotion/styled"
// Styled components without theme
const DropZone = styled(Paper)(({ isdragover }) => ({
  border: '2px dashed #1976d2', // Static color instead of theme.palette.primary.main
  backgroundColor: isdragover ? 'rgba(0, 0, 0, 0.04)' : '#ffffff', // Static background colors
  borderRadius: 16,
  padding: 32, // Static padding instead of theme.spacing(4)
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Static shadow instead of theme.shadows[8]
  },
}));

const StyledTable = styled(Table)({
  '& .MuiTableCell-head': {
    fontWeight: 600,
    backgroundColor: '#f5f5f5', // Static background color
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Static background color
  },
});

function ImportStudentsPage() {
  const [students, setStudents] = useState([]);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        const formattedStudents = parsedData.slice(1).map((row) => ({
          name: String(row[0] || '').trim(),
          email: String(row[1] || '').trim(),
          mobile: String(row[2] || '').trim(),
          role: String(row[3] || '').trim(),
        }));

        setStudents(formattedStudents);
        setPreview(formattedStudents.slice(0, 5));
        setError('');
      } catch (err) {
        setError('Invalid file format. Please upload a valid Excel file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = () => {
    if (preview.length === 0) {
      setError('Please upload a valid Excel file with student details.');
      return;
    }

    const invalidEntries = preview.filter(
      (s) => !s.email.includes('@') || !s.name || !s.mobile || !s.role
    );

    if (invalidEntries.length > 0) {
      setError('Some rows have missing or invalid details. Please check the file.');
    } else {
      setError('');
      setConfirmed(true);
    }
  };

  const handleSendInvites = async () => {
    if (!confirmed) {
      setError("Please confirm the uploaded data before sending invites.");
      return;
    }
  
    setLoading(true);
    console.log(students);
    try {
      const response = await fetch("http://localhost:8000/send-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send invites");
      }

      const data = await response.json();
      console.log("Response Data:", data);

      alert("Invites sent successfully!");

      // Show the returned email-password list (optional)
      if (data.students && data.students.length > 0) {
        console.table(data.students);  // Logs emails & passwords in a table format
      }

      // Reset state
      setConfirmed(false);
      setStudents([]);
      setPreview([]);
      setError("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  
  return (
           <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

                {/* Background Video */}
     
          {/* Foreground Video */}
  
  <video
     src="../public/videos/ImportCsv.mp4" 
  autoPlay
  muted
  loop
  playsinline           
  aria-hidden="true"    
  className="absolute inset-0 blur-sm w-full h-full object-cover z-[-1]" 
  ></video>

    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
     <h1 className=" lg:text-7xl md:text-5xl text-5xl font-bold leading-[1.1]  block bg-gradient-to-r from-[#fffdfd] pb-10 via-[#979696] to-[#ffffff] bg-clip-text text-transparent drop-shadow-none  text-[48px]">
          Student Import Manager
       </h1>
       <p className=" lg:text-2xl md:text-xl text-xl  leading-[1.1]  text-white">
          Upload, preview, and manage student data with ease
        </p>
      </Box>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="file-upload"
      />

      <DropZone
        isdragover={isDragging ? 1 : 0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <CloudUpload sx={{ fontSize: 64, mb: 2, color: '#1976d2' }} />
        <Typography variant="h6" gutterBottom>
          Drag & Drop Excel File or Click to Upload
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: .xlsx, .xls
        </Typography>
        {loading && <LinearProgress sx={{ width: '100%', mt: 2 }} />}
      </DropZone>

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mt: 3 }} icon={<Error />}>
            {error}
            <IconButton size="small" onClick={() => setError('')} sx={{ ml: 1 }}>
              <HighlightOff fontSize="small" />
            </IconButton>
          </Alert>
        </Fade>
      )}

      {preview.length > 0 && (
        <Slide direction="up" in={preview.length > 0} mountOnEnter unmountOnExit>
          <Box mt={6}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              Data Preview
              <CheckCircle
                color={confirmed ? 'success' : 'disabled'}
                sx={{ ml: 1, fontSize: 32 }}
              />
            </Typography>

            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 4 }}>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.mobile}</TableCell>
                      <TableCell>{student.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </TableContainer>

            <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleConfirmUpload}
                disabled={confirmed}
                startIcon={<CheckCircle />}
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                {confirmed ? 'Confirmed' : 'Verify Data'}
              </Button>
            </Box>
          </Box>
        </Slide>
      )}

      {confirmed && (
        <Fade in={confirmed}>
          <Box mt={6} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendInvites}
              disabled={loading}
              startIcon={<Send />}
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: 18,
                borderRadius: 3,
                boxShadow: 4,
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              {loading ? 'Sending Invites...' : 'Send Invites to All Students'}
            </Button>
            <Typography variant="body2" color="text.secondary" mt={2}>
              {students.length} students ready for invitation
            </Typography>
          </Box>
        </Fade>
      )}
    </Container>
    </div>
   
  );
}

export default ImportStudentsPage;