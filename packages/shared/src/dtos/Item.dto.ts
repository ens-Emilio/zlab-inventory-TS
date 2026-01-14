export interface ItemDTO {
    id: number;
    public_id: string; // UUID
    name: string;
    description?: string;
    category_id?: number;
    location_id?: number;
    quantity: number;
    price?: number;
    purchase_date?: Date | string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateItemDTO {
    name: string;
    description?: string;
    category_id?: number;
    location_id?: number;
    quantity: number;
    price?: number;
    purchase_date?: Date | string;
}

export interface UpdateItemDTO extends Partial<CreateItemDTO> { }
