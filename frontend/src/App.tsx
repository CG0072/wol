import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardContent, Button, TextField,
  List, ListItem, ListItemText, ListItemSecondaryAction 
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
