const express = require('express');
const cors = require('cors');
const wol = require('wakeonlan');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/wake', async (req, res) => {
  const { mac } = req.body;
  
  try {
    await wol(mac);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending WoL packet:', error);
    res.status(500).json({ error: 'Failed to send WoL packet' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
