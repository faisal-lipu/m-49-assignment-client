import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// ==============================================================
// Check User Existence API (/api/auth/check-user)
// Checks if an email is registered in the BetterAuth user collection.
// Used by the Login page to determine if an unregistered user should
// be notified and redirected to the Register page.
// ==============================================================

const dbUrl =
  process.env.BETTER_AUTH_DB_URL ||
  'mongodb+srv://foisaliftekharlipu_db_user:Lipunext12345@cluster0.qji0htb.mongodb.net/maitriDB?appName=Cluster0';

let client: MongoClient | null = null;

async function getDb() {
  if (!client) {
    client = new MongoClient(dbUrl);
    await client.connect();
  }
  return client.db('maitriDB');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ exists: false });
    }

    const db = await getDb();
    const normalizedEmail = email.trim().toLowerCase();

    // Query the user collection created by BetterAuth
    const user = await db.collection('user').findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
    });

    return NextResponse.json({
      exists: !!user,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('Check user error:', error);
    // In case of database error, return exists: true so login attempt can continue normally
    return NextResponse.json({ exists: true });
  }
}
