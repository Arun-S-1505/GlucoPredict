import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This is a placeholder - actual ML inference would need Python runtime
    // For production, use Railway/Render for the Flask backend
    const mockResponse = {
      risk: 'normal',
      message: 'Normal - Low Risk of Diabetes',
      probabilities: { normal: 0.7, borderline: 0.2, high: 0.1 },
      predicted_class: 0,
      model_accuracy: 86.4,
      response_time_ms: 150
    };

    res.status(200).json(mockResponse);
  } catch (error) {
    res.status(500).json({ error: 'Prediction failed' });
  }
}