export default async function handler(req) {
  return new Response(
    JSON.stringify({ message: 'Test API works!' }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
