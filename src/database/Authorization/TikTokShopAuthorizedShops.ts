import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import database from '../Connect';
import { TIK_TOK_SELLER_ID } from '../../constants';

interface IAuthorizedShop {
    id: string;
    name: string;
    region: string;
    seller_type: string;
    cipher: string;
    code: string;
    seller_id: string; // Added seller_id field
}

class AuthorizedShops {
    private connection: Promise<PoolConnection>;

    constructor() {
        this.connection = database.getConnection();
    }

    async getShopById(shopId: string): Promise<IAuthorizedShop> {
        const query = `SELECT * FROM AuthorizedShops WHERE id = ?`;
        const params = [shopId];
        try {
            const connection = await this.connection;
            const [rows] = await connection.query<RowDataPacket[]>(query, params);

            if (rows.length === 0) {
                throw new Error("Unable to find shop");
            }

            return rows[0] as unknown as IAuthorizedShop;
        } catch (error) {
            throw new Error("Error retrieving shop: " + error);
        }
    }

    async upsertShop(shop: IAuthorizedShop) {
        const query = `INSERT INTO AuthorizedShops (id, name, region, seller_type, cipher, code, seller_id)
                       VALUES (?, ?, ?, ?, ?, ?, ?)
                       ON DUPLICATE KEY UPDATE
                       name = VALUES(name),
                       region = VALUES(region),
                       seller_type = VALUES(seller_type),
                       cipher = VALUES(cipher),
                       code = VALUES(code),
                       seller_id = VALUES(seller_id)`;
        const params = [
            shop.id,
            shop.name,
            shop.region,
            shop.seller_type,
            shop.cipher,
            shop.code,
            TIK_TOK_SELLER_ID // Use the constant value for seller ID
        ];
        try {
            const connection = await this.connection;
            await connection.query(query, params);
        } catch (error) {
            throw new Error("Error upserting shop: " + error);
        }
    }

    async deleteShop(shopId: string) {
        const query = `DELETE FROM AuthorizedShops WHERE id = ?`;
        const params = [shopId];
        try {
            const connection = await this.connection;
            await connection.query(query, params);
        } catch (error) {
            throw new Error("Error deleting shop: " + error);
        }
    }
}

export default AuthorizedShops;
