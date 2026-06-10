export default async function handler(req: any, res: any) {
  try {
    // attempt to load the server module dynamically to catch the error
    await import('../server.js');
    res.status(200).send("No error loading server.js!");
  } catch (e: any) {
    res.status(500).send("MODULE ERROR:\n" + e.message + "\n\n" + e.stack);
  }
}
