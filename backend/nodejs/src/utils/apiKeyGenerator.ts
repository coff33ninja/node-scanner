import crypto from 'crypto';
import db from '../config/database';

export const generateApiKey = (userId: number, name: string = 'default'): string => {
  const apiKey = `upsnap_${crypto.randomBytes(32).toString('hex')}`;
  
  const stmt = db.prepare(`
    INSERT INTO api_keys (key, name, user_id)
    VALUES (?, ?, ?)
  `);
  
  stmt.run(apiKey, name, userId);
  
  return apiKey;
};

export const validateApiKey = (apiKey: string): boolean => {
  const stmt = db.prepare('SELECT * FROM api_keys WHERE key = ? AND is_active = 1');
  const result = stmt.get(apiKey);
  
  if (result) {
    // Update last used timestamp
    db.prepare('UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE id = ?')
      .run(result.id);
    return true;
  }
  
  return false;
};