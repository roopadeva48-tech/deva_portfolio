import { Router, Request, Response } from 'express';

export const contactRouter = Router();

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

const receivedMessages: ContactMessage[] = [
  {
    id: 'msg-seed-1',
    name: 'Elena Rostova',
    email: 'elena@kineticdesign.studio',
    subject: '3D Spatial Interactive Exhibit Collaboration',
    message: 'Loved the miniature globe concept and the fluid camera dollies! We are developing a digital showroom and would love to partner.',
    timestamp: '2026-10-06T14:32:00.000Z'
  }
];

contactRouter.post('/', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Name is required' });
    return;
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'A valid email address is required' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ success: false, error: 'Message must be at least 5 characters' });
    return;
  }

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : 'Project Inquiry via 3D Globe',
    message: message.trim(),
    timestamp: new Date().toISOString()
  };

  receivedMessages.unshift(newMessage);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message was received by Roopa Deva.',
    data: newMessage
  });
});

contactRouter.get('/messages', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: receivedMessages
  });
});
