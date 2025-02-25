import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardContent, Button, TextField,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Grid 
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

interface Device {
  name: string;
  mac: string;
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDevice, setNewDevice] = useState({ name: '', mac: '' });
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

  const addDevice = () => {
    if (newDevice.name && newDevice.mac) {
      const updatedDevices = [...devices, newDevice];
      saveDevices(updatedDevices);
      setNewDevice({ name: '', mac: '' });
    }
  };

  const wakeDevice = async (mac: string) => {
    try {
      await fetch(`${serverUrl}/wake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mac })
      });
    } catch (error) {
      console.error('Failed to wake device:', error);
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
                    onClick={() => wakeDevice(device.mac)}
                    startIcon={<PowerSettingsNewIcon />}
                  >
                    Wake
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
