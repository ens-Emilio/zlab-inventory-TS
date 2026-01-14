export interface Item {
    id: number;
    name: string;
    description?: string;
    category_id?: number;
    location_id?: number;
    quantity: number;
    price?: number;
    purchase_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}
