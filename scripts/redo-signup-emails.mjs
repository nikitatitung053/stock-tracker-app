import mongoose from 'mongoose';
import { Inngest } from 'inngest';

async function main() {
  const uri = process.env.MONGODB_URI;
  const eventKey = process.env.INNGEST_EVENT_KEY;

  if (!uri) {
    console.error('ERROR: MONGODB_URI must be set in .env');
    process.exit(1);
  }

  if (!eventKey) {
    console.error('ERROR: INNGEST_EVENT_KEY must be set in .env');
    process.exit(1);
  }

  const inngest = new Inngest({
    id: 'Tradexx',
    eventKey,
  });

  try {
    await mongoose.connect(uri, { bufferCommands: false });

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Mongoose connection not connected');
    }

    const users = await db
      .collection('user')
      .find({ email: { $exists: true, $ne: null } })
      .project({
        email: 1,
        name: 1,
        country: 1,
        investmentGoals: 1,
        riskTolerance: 1,
        preferredIndustry: 1,
      })
      .toArray();

    const filtered = users.filter((user) => user.email && user.name);
    console.log(`Found ${filtered.length} users with email+name.`);

    let sent = 0;
    for (const user of filtered) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email: user.email,
          name: user.name,
          country: user.country || null,
          investmentGoals: user.investmentGoals || null,
          riskTolerance: user.riskTolerance || null,
          preferredIndustry: user.preferredIndustry || null,
        },
      });
      sent += 1;
      if (sent % 25 === 0) {
        console.log(`Sent ${sent} signup events...`);
      }
    }

    console.log(`Done. Sent ${sent} signup events.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR: failed to send signup events');
    console.error(err);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
}

main();
