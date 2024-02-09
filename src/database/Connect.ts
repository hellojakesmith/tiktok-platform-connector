import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { MYSQL_HOST, MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USERNAME } from '../constants';

class MySQLDatabase {
  private pool: Pool;

  constructor(config: any) {
    this.pool = mysql.createPool(config);
  }

  public async getConnection(): Promise<PoolConnection> {
    const connection = await this.pool.getConnection();
    return connection;
  }
}

const dbConfig: any = {
  host: MYSQL_HOST,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
};

const database = new MySQLDatabase(dbConfig);

async function createTables() {
  const connection = await database.getConnection();

  // TikTok Shop Tokens
  await connection.execute(`
  CREATE TABLE IF NOT EXISTS TikTokShopTokens (
    seller_id VARCHAR(255) PRIMARY KEY,
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    access_token_expire_in BIGINT NOT NULL,
    refresh_token_expire_in BIGINT NOT NULL,
    open_id VARCHAR(255) NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    seller_base_region VARCHAR(255) NOT NULL,
    user_type INT NOT NULL
  );
`);

  // Authorized Shops
  await connection.execute(`
  CREATE TABLE IF NOT EXISTS AuthorizedShops (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    seller_type VARCHAR(255) NOT NULL,
    cipher VARCHAR(255),
    code VARCHAR(255),
    seller_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (seller_id) REFERENCES TikTokShopTokens(seller_id)
  );
`);

  await connection.release();
}

// Call createTables function at startup
createTables().catch(console.error);

export default database;
