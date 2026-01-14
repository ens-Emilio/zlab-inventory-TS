import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { StockMovement } from '../domain/StockMovement';
import { CreateStockMovementDTO } from '@zlab/shared';
import { pool } from '../db/pool';

export class StockMovementRepository {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    // Allows passing a transaction connection
    async create(data: CreateStockMovementDTO, connection?: PoolConnection): Promise<number> {
        const executor = connection || this.db;
        const { item_id, type, quantity, location_id_from, location_id_to, reason } = data;

        const [result] = await executor.query<ResultSetHeader>(
            `INSERT INTO stock_movements 
            (public_id, item_id, type, quantity, location_id_from, location_id_to, reason) 
            VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
            [item_id, type, quantity, location_id_from, location_id_to, reason]
        );
        return result.insertId;
    }

    async findByItemId(itemId: number): Promise<StockMovement[]> {
        const [rows] = await this.db.query<RowDataPacket[]>(
            'SELECT * FROM stock_movements WHERE item_id = ? ORDER BY created_at DESC',
            [itemId]
        );
        return rows as StockMovement[];
    }
}
