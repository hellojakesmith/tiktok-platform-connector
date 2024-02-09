import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import database from '../Connect';

interface ITikTokShopTokens {
    seller_id: string;
    access_token: string;
    refresh_token: string;
    access_token_expire_in: number;
    refresh_token_expire_in: number;
    open_id: string;
    seller_name: string;
    seller_base_region: string;
    user_type: number;
}

class TikTokShopAccessTokens {
    private connection: Promise<PoolConnection>;

    constructor() {
        this.connection = database.getConnection();
    }

    async getShopTokenBySlug(shopSlug: string): Promise<ITikTokShopTokens> {
        const query = `SELECT * FROM TikTokShopTokens WHERE seller_id = ?`;
        const params = [shopSlug];
        try {
            const connection = await this.connection;
            const [rows] = await connection.query<RowDataPacket[]>(query, params);

            if (rows.length === 0) {
                throw new Error("Unable to find shop access tokens");
            }

            return rows[0] as unknown as ITikTokShopTokens;
        } catch (error) {
            throw new Error("Error retrieving shop access tokens: " + error);
        }
    }

    async upsertShopTokens(tokens: ITikTokShopTokens) {
        const query = `INSERT INTO TikTokShopTokens (seller_id, access_token, refresh_token, access_token_expire_in, refresh_token_expire_in, open_id, seller_name, seller_base_region, user_type)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                   access_token = VALUES(access_token),
                   refresh_token = VALUES(refresh_token),
                   access_token_expire_in = VALUES(access_token_expire_in),
                   refresh_token_expire_in = VALUES(refresh_token_expire_in),
                   open_id = VALUES(open_id),
                   seller_name = VALUES(seller_name),
                   seller_base_region = VALUES(seller_base_region),
                   user_type = VALUES(user_type)`;
        const params = [
            tokens.seller_id,
            tokens.access_token,
            tokens.refresh_token,
            tokens.access_token_expire_in,
            tokens.refresh_token_expire_in,
            tokens.open_id,
            tokens.seller_name,
            tokens.seller_base_region,
            tokens.user_type
        ];
        try {
            const connection = await this.connection;
            await connection.query(query, params);
        } catch (error) {
            throw new Error("Error upserting shop access tokens: " + error);
        }
    }

    async deleteShopTokens(shopSlug: string) {
        const query = `DELETE FROM TikTokShopTokens WHERE seller_id = ?`;
        const params = [shopSlug];
        try {
            const connection = await this.connection;
            await connection.query(query, params);
        } catch (error) {
            throw new Error("Error deleting shop access tokens: " + error);
        }
    }

}

export default TikTokShopAccessTokens;
