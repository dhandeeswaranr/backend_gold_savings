import pool from '../db';

const initDB = async () => {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Drop tables in reverse order to avoid foreign key constraints
    await pool.query(`DROP TABLE IF EXISTS payments CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS profile CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS user_roles CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS roles CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

    await pool.query(
        `CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        user_id UUID DEFAULT uuid_generate_v4() UNIQUE, 
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        roles VARCHAR(50)
        )`
    );

    await pool.query(
        `CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
    )`
    );

    await pool.query(
        `CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_role
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );`
    )

    await pool.query(
        `CREATE TABLE profile (
        id SERIAL PRIMARY KEY,
        user_id UUID UNIQUE  REFERENCES users(user_id) ON DELETE CASCADE,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        address TEXT,
        location VARCHAR(100),
        village VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(100),
        pin VARCHAR(20),
        landmark VARCHAR(100),
        scheme VARCHAR(100),
        isAccept BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    );

    await pool.query(`
        CREATE TABLE payments (
            id SERIAL PRIMARY KEY,

            payment_id UUID DEFAULT uuid_generate_v4() UNIQUE, -- public reference

            user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

            amount NUMERIC(10,2) NOT NULL,
            currency VARCHAR(10) DEFAULT 'INR',

            payment_method VARCHAR(50), -- UPI, CARD, NETBANKING, CASH

            payment_status VARCHAR(20) DEFAULT 'PENDING', 
            -- PENDING, SUCCESS, FAILED, REFUNDED

            transaction_id VARCHAR(100), -- from payment gateway

            description TEXT,

            paid_at TIMESTAMP, -- when payment completed

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

    console.log("TABLES CREATED")
}

export default initDB;