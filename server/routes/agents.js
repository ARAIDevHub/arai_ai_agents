const express = require('express');
const router = express.Router();
const { deleteSeason } = require('../controllers/agentsController');

// Route to delete a season
router.delete('/agents/seasons/:seasonId', async (req, res) => {
  try {
    const { seasonId } = req.params;
    await deleteSeason(seasonId);
    res.status(200).json({ message: 'Season deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 