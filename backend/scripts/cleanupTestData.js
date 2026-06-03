const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Application = require('../models/Application');
const Job = require('../models/Job');
const WorkSession = require('../models/WorkSession');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const reactJob = await Job.findOne({ title: /React Developer/i, company: /Ahmed Tech/i });
    const appsBefore = await Application.countDocuments();
    const sessionsBefore = await WorkSession.countDocuments();
    console.log('Applications before:', appsBefore);
    console.log('WorkSessions before:', sessionsBefore);

    if (reactJob) {
      console.log('Found React Developer job:', reactJob._id.toString());
      await Job.deleteOne({ _id: reactJob._id });
      console.log('Deleted React Developer job.');
      const appsDeleted = await Application.deleteMany({ jobId: reactJob._id });
      console.log('Deleted applications tied to that job:', appsDeleted.deletedCount);
    } else {
      console.log('React Developer job not found.');
    }

    const appsClear = await Application.deleteMany({});
    console.log('Deleted all applications:', appsClear.deletedCount);
    const sessionsClear = await WorkSession.deleteMany({});
    console.log('Deleted all work sessions:', sessionsClear.deletedCount);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();