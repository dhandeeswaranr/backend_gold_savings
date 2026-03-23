import { Pool } from 'pg';
/**L
 * Local database connection
 */

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'jewel',
  port: 5432,
});

/**
 * Render.com database connection
 */
// const pool = new Pool({
//   host: 'dpg-d6p8emf5r7bs73fc4dag-a.oregon-postgres.render.com',
//   user: 'dhandy_0',
//   password: 'vViXdHyxQb3AZKeUIYqlPfdoRrbrKyIe',
//   database: 'school_6ybj',
//   port: 5432,
//    ssl: {
//     rejectUnauthorized: false
//   }
// });


export default pool;