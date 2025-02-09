import { db } from "@vercel/postgres";

const client = await db.connect();

async function listInvoices() {
  //normal query
	// const data = await client.sql`
  //   SELECT invoices.amount, customers.name
  //   FROM invoices
  //   JOIN customers ON invoices.customer_id = customers.id
  //   WHERE invoices.amount = 666;
  // `;

  // for dropping table
  await client.sql`
    DROP TABLE watchlist;
  `;
  await client.sql`
    DROP TABLE users;
  `;
  await client.sql`
    DROP TABLE stocks;
  `;


  return { message: "all tables dropped successfully." };
}

export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    console.error("Error:", error);
  	return Response.json({ error }, { status: 500 });
  }
  finally {
    client.release();
  }
}
