import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return error - backend not deployed yet
  return res.status(503).json({
    error: 'Backend service not available. Please deploy the Flask backend to Render/Railway first.',
    message: 'The diabetes prediction backend is not currently deployed. Deploy the backend service to enable real ML predictions.'
  });
}