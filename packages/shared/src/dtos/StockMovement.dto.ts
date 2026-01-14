export enum StockMovementType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT',
    TRANSFER = 'TRANSFER'
}

export interface StockMovementDTO {
    id: number;
    public_id: string;
    item_id: number;
    type: StockMovementType;
    quantity: number;
    location_id_from?: number;
    location_id_to?: number;
    reason?: string;
    created_at: Date;
}

export interface CreateStockMovementDTO {
    item_id: number;
    type: StockMovementType;
    quantity: number;
    location_id_from?: number;
    location_id_to?: number;
    reason?: string;
}
