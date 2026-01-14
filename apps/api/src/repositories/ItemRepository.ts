import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Item } from '../domain/Item';
import { CreateItemDTO, UpdateItemDTO } from '@zlab/shared';
import { pool } from '../db/pool';

export class ItemRepository {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    async findAll(): Promise<Item[]> {
        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM items');
        return rows as Item[];
    }

    async findById(id: number): Promise<Item | null> {
        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM items WHERE id = ?', [id]);
        const items = rows as Item[];
        return items.length > 0 ? items[0] : null;
    }

    async create(item: CreateItemDTO): Promise<number> {
        const { name, description, category_id, location_id, quantity, price, purchase_date } = item;
        // Uses MySQL UUID() function for public_id
        const [result] = await this.db.query<ResultSetHeader>(
            'INSERT INTO items (public_id, name, description, category_id, location_id, quantity, price, purchase_date) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
            [name, description, category_id, location_id, quantity, price, purchase_date]
        );
        return result.insertId;
    }

    async update(id: number, item: UpdateItemDTO): Promise<boolean> {
        // Dynamically build query
        const fields: string[] = [];
        const values: any[] = [];

        if (item.name !== undefined) { fields.push('name = ?'); values.push(item.name); }
        if (item.description !== undefined) { fields.push('description = ?'); values.push(item.description); }
        if (item.category_id !== undefined) { fields.push('category_id = ?'); values.push(item.category_id); }
        if (item.location_id !== undefined) { fields.push('location_id = ?'); values.push(item.location_id); }
        if (item.quantity !== undefined) { fields.push('quantity = ?'); values.push(item.quantity); }
        if (item.price !== undefined) { fields.push('price = ?'); values.push(item.price); }
        if (item.purchase_date !== undefined) { fields.push('purchase_date = ?'); values.push(item.purchase_date); }

        if (fields.length === 0) return false;

        values.push(id);
        const sql = `UPDATE items SET ${fields.join(', ')} WHERE id = ?`;

        const [result] = await this.db.query<ResultSetHeader>(sql, values);
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await this.db.query<ResultSetHeader>('DELETE FROM items WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
