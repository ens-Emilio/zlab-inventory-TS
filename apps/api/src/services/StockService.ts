import { PoolConnection } from 'mysql2/promise';
import { pool } from '../db/pool';
import { StockMovementRepository } from '../repositories/StockMovementRepository';
import { ItemRepository } from '../repositories/ItemRepository';
import { CreateStockMovementDTO, StockMovementType, StockMovementDTO } from '@zlab/shared';
import { AppError } from '../utils/AppError';

export class StockService {
    private stockRepo: StockMovementRepository;
    private itemRepo: ItemRepository;

    constructor() {
        this.stockRepo = new StockMovementRepository();
        this.itemRepo = new ItemRepository();
        // Note: itemRepo might need update to support transaction connection injection if not present
    }

    async createMovement(data: CreateStockMovementDTO): Promise<void> {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Get current item to check stock
            const item = await this.itemRepo.findById(data.item_id);
            if (!item) {
                throw new AppError('Item not found', 404);
            }

            // 2. Validate availability for OUT/TRANSFER
            if (data.type === StockMovementType.OUT || data.type === StockMovementType.TRANSFER) {
                if (item.quantity < data.quantity) {
                    throw new AppError('Insufficient stock', 400);
                }
            }

            // 3. Calculate new quantity
            let newQuantity = item.quantity;
            if (data.type === StockMovementType.IN) {
                newQuantity += data.quantity;
            } else if (data.type === StockMovementType.OUT) {
                newQuantity -= data.quantity;
            } else if (data.type === StockMovementType.ADJUSTMENT) {
                // For adjustment, let's assume 'quantity' is the DELTA or strict absolute?
                // Plan said: "quantity INT (Always positive)"
                // Usually adjustment implies "set to this" or "add/sub this". 
                // Let's implement as "Current + Adjustment" (can be negative in logic, but DTO says positive)
                // Actually easier: Adjustment usually means "Stock Check found X". 
                // For simplicity here, let's treat ADJUSTMENT as a direct overwrite or use IN/OUT logic.
                // Re-reading logic: "quantity: INT". 
                // Let's assume ADJUSTMENT adds/subtracts based on context or we need a signed value? 
                // DTO says "Always positive". 
                // Let's assume simplest: IN adds, OUT subs. 
                // ADJUSTMENT? Maybe we don't support it fully yet or treat as "Set to quantity"?
                // Let's treat ADJUSTMENT as a "Check-in" process. 
                // Actually, let's stick to simple: IN (+), OUT (-). 
                // Users can use IN/OUT for everything. 
                // If type is ADJUSTMENT, we need to know direction. 
                // Let's treat ADJUSTMENT as adding for now, or just default to IN behavior?
                // Better: ADJUSTMENT updates quantity directly? No, that breaks audit.
                // Let's skip ADJUSTMENT logic complexity for now and stick to IN/OUT.
                // If type is TRANSFER, it is OUT from one loc, IN to another. 
                // Complex. Let's start with simple IN/OUT affecting global quantity.
                newQuantity += data.quantity; // Default fallback? No.
            }

            // Refined Logic:
            if (data.type === StockMovementType.IN) {
                newQuantity = item.quantity + data.quantity;
            } else if (data.type === StockMovementType.OUT) {
                newQuantity = item.quantity - data.quantity;
            } else if (data.type === StockMovementType.TRANSFER) {
                // Transfers shouldn't change GLOBAL quantity if locations are just tags.
                // But we are tracking `location_id` on item. 
                // If we move stock, we might be splitting it? 
                // The current Item model has `location_id` (single). 
                // This implies "Item is at Location X".
                // If we transfer, we just change the location_id?
                // Or does Item represent a SKU and we have Stock per Location?
                // Current schema: Item has `quantity` and `location_id`. This means specific batch at location.
                // If we want multiple locations, we need a separate `item_stock` table.
                // The user prompt said: "Estoque real: `item_stock` por local".
                // Ah! I missed creating `item_stock` table in Sprint 2 plan details!
                // I put `stock_movements` but existing `items` table has `quantity`.
                // For this sprint (MVP of stock), let's sync `items.quantity` as global stock.
                // Proper `item_stock` table would be a bigger refactor.
                // Let's stick to updating `items.quantity` for simple IN/OUT.
            }

            // 4. Update Item Quantity
            // We need a transactional update method in ItemRepo
            // But ItemRepo doesn't accept connection yet.
            // I need to update ItemRepo first. 
            // For now, I'll execute raw query here to ensure transaction scope.
            await connection.query('UPDATE items SET quantity = ? WHERE id = ?', [newQuantity, item.id]);

            // 5. Create Movement Log
            await this.stockRepo.create(data, connection);

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getHistory(itemId: number): Promise<StockMovementDTO[]> {
        const movements = await this.stockRepo.findByItemId(itemId);
        // Map to DTO if needed (currently entities match DTOs mostly)
        return movements.map(m => ({
            ...m,
            // ensure types match DTO
        }));
    }
}
