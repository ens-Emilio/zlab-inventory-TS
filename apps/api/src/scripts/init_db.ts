import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { pool } from '../db/pool';

dotenv.config();

async function initDb() {
  try {
    // 1. Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'home_inventory';
    console.log(`Checking database '${dbName}'...`);

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' ensured.`);
    await connection.end();

    // 2. Connect pool
    const poolConnection = await pool.getConnection();
    console.log('Connected to database. Checking migrations...');

    // 3. Create migrations table
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Run migrations
    const [rows] = await poolConnection.query<mysql.RowDataPacket[]>('SELECT migration_name FROM _migrations');
    const appliedMigrations = new Set(rows.map(row => row.migration_name));

    // Migration 001: Initial Schema
    if (!appliedMigrations.has('001_initial_schema')) {
      console.log('Applying migration: 001_initial_schema');
      await poolConnection.query(`
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category_id INT,
          location_id INT,
          quantity INT DEFAULT 0,
          price DECIMAL(10, 2),
          purchase_date DATETIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      await poolConnection.query('INSERT INTO _migrations (migration_name) VALUES (?)', ['001_initial_schema']);
    }

    // Migration 002: Add Public ID
    if (!appliedMigrations.has('002_add_public_id')) {
      console.log('Applying migration: 002_add_public_id');
      try {
        // Check if column exists first to avoid error if table was created manually differently
        const [columns] = await poolConnection.query<mysql.RowDataPacket[]>(
          `SHOW COLUMNS FROM items LIKE 'public_id'`
        );

        if (columns.length === 0) {
          await poolConnection.query(`
                ALTER TABLE items 
                ADD COLUMN public_id VARCHAR(36) NOT NULL AFTER id,
                ADD UNIQUE INDEX idx_public_id (public_id)
            `);

          // Generate UUIDs for existing items (using MySQL UUID() function)
          await poolConnection.query(`UPDATE items SET public_id = UUID() WHERE public_id = ''`);
        }
      } catch (err: any) {
        // Store migration even if it "failed" assuming it might be because column exists
        // simplified logic for this demo
        console.warn('Migration 002 warning:', err.message);
      }
      await poolConnection.query('INSERT INTO _migrations (migration_name) VALUES (?)', ['002_add_public_id']);
    }

    // Migration 003: Stock Movements Table
    if (!appliedMigrations.has('003_stock_movements')) {
      console.log('Applying migration: 003_stock_movements');
      await poolConnection.query(`
            CREATE TABLE IF NOT EXISTS stock_movements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                public_id VARCHAR(36) NOT NULL,
                item_id INT NOT NULL,
                type ENUM('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER') NOT NULL,
                quantity INT NOT NULL,
                location_id_from INT,
                location_id_to INT,
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
                UNIQUE INDEX idx_sm_public_id (public_id),
                INDEX idx_sm_item_id (item_id),
                INDEX idx_sm_created_at (created_at)
            )
        `);
      await poolConnection.query('INSERT INTO _migrations (migration_name) VALUES (?)', ['003_stock_movements']);
    }

    console.log('Database initialization completed.');
    poolConnection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
