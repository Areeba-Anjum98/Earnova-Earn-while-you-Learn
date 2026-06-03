const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Application = require('../models/Application');
const Job = require('../models/Job');
const WorkSession = require('../models/WorkSession');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Starting cleanup of zero earnings sessions...');
    
    // Find and delete sessions with 0.00 earnings or no earnings
    const sessionsBefore = await WorkSession.countDocuments();
    const zeroSessionsDeleted = await WorkSession.deleteMany({
      $or: [
        { earnings: 0 },
        { earnings: null },
        { earnings: undefined }
      ]
    });
    console.log('Deleted sessions with 0.00 or null earnings:', zeroSessionsDeleted.deletedCount);
    
    // Find Full Stack Developer (Junior) job and delete related applications
    const juniorJob = await Job.findOne({ title: /Full Stack Developer.*Junior/i });
    if (juniorJob) {
      console.log('Found Full Stack Developer (Junior) job:', juniorJob._id.toString());
      const appsDeleted = await Application.deleteMany({ jobId: juniorJob._id });
      console.log('Deleted applications for that job:', appsDeleted.deletedCount);
    } else {
      console.log('Full Stack Developer (Junior) job not found.');
    }
    
    const sessionsAfter = await WorkSession.countDocuments();
    console.log('Sessions remaining:', sessionsAfter);
    
    await mongoose.disconnect();
    console.log('Cleanup complete!');
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
})();
