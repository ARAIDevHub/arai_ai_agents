const Season = require('../models/Season'); // Assuming you have a Season model

async function deleteSeason(seasonId) {
  // Logic to delete the season from the database
  await Season.findByIdAndDelete(seasonId);
}

module.exports = {
  deleteSeason,
}; 