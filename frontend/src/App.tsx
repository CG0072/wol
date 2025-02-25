import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardContent, Button, TextField,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Grid, Snackbar, Alert, CircularProgress 
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

interface Device {
  name: string;
  mac: string;
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDevice, setNewDevice] = useState({ name: '', mac: '' });
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const serverUrl = process.env.REACT_APP_SERVER_URL || 'https://wol.cg0072.lu';

  useEffect(() => {
    const savedDevices = localStorage.getItem('devices');
    if (savedDevices) {
      setDevices(JSON.parse(savedDevices));
    }
  }, []);

  const saveDevices = (newDevices: Device[]) => {
    localStorage.setItem('devices', JSON.stringify(newDevices));
    setDevices(newDevices);
  };

  const validateMac = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const addDevice = () => {
    if (!newDevice.name) {
      setMessage({ text: 'Please enter a device name', type: 'error' });
      return;
    }
    if (!validateMac(newDevice.mac)) {
      setMessage({ text: 'Invalid MAC address format (XX:XX:XX:XX:XX:XX)', type: 'error' });
      return;
    }
    
    const updatedDevices = [...devices, newDevice];
    saveDevices(updatedDevices);
    setNewDevice({ name: '', mac: '' });
    setMessage({ text: 'Device added successfully', type: 'success' });
  };

  const wakeDevice = async (mac: string, name: string) => {
    setIsLoading({...isLoading, [mac]: true});
    try {
      const response = await fetch(`${serverUrl}/wake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mac })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setMessage({ text: `Wake signal sent to ${name}`, type: 'success' });
    } catch (error) {
      setMessage({ text: `Failed to wake ${name}: ${error}`, type: 'error' });
    } finally {
      setIsLoading({...isLoading, [mac]: false});
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Wake-on-LAN Controller</h1>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Device Name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="MAC Address"
                value={newDevice.mac}
                onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={addDevice}
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <List>
            {devices.map((device) => (
              <ListItem key={device.mac}>
                <ListItemText primary={device.name} secondary={device.mac} />
                <ListItemSecondaryAction>
                  <Button
                    onClick={() => wakeDevice(device.mac, device.name)}
                    startIcon={isLoading[device.mac] ? 
                      <CircularProgress size={20} /> : 
                      <PowerSettingsNewIcon />}
                    disabled={isLoading[device.mac]}
                  >
                    {isLoading[device.mac] ? 'Sending...' : 'Wake'}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Snackbar 
        open={message !== null} 
        autoHideDuration={6000} 
        onClose={() => setMessage(null)}
      >
        <Alert severity={message?.type} onClose={() => setMessage(null)}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
