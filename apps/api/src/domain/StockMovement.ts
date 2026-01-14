import { StockMovementType } from '@zlab/shared';

export interface StockMovement {
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
