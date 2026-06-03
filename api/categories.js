import { mockData } from '../src/api/mockData.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(mockData.categories);
  } else if (req.method === 'POST') {
    const newCategory = {
      id: Math.random().toString(36).substr(2, 12),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    mockData.categories.push(newCategory);
    res.status(201).json(newCategory);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
