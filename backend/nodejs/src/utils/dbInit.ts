import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const DEFAULT_ADMIN_PASSWORD = 'abcd1234!';
const DB_PATH = path.join(__dirname, '../../database.sqlite');
const CLEAN_DB_PATH = path.join(__dirname, '../../clean-database.sqlite');

export const initializeCleanDatabase = () => {
  const db = new Database(CLEAN_DB_PATH);

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mac_address TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      user_id INTEGER,
      wake_command TEXT,
      ping_command TEXT,
      shutdown_command TEXT,
      sol_port INTEGER DEFAULT 0,
      require_confirmation BOOLEAN DEFAULT 0,
      enable_wake_cron BOOLEAN DEFAULT 0,
      wake_cron_schedule TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create default admin user
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, salt);
  
  db.prepare(`
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run('admin', 'admin@abcd.1234', hashedPassword, 'admin');

  db.close();
  console.log('Clean database created successfully');
};

export const resetDatabase = () => {
  try {
    // Remove existing database if it exists
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }
    
    // Copy clean database to working location
    fs.copyFileSync(CLEAN_DB_PATH, DB_PATH);
    console.log('Database reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};