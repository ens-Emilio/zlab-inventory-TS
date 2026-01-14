import { ItemRepository } from '../repositories/ItemRepository';
import { Item } from '../domain/Item';
import { CreateItemDTO, UpdateItemDTO } from '@zlab/shared';

export class ItemService {
    private repository: ItemRepository;

    constructor() {
        this.repository = new ItemRepository();
    }

    async getAllItems(): Promise<Item[]> {
        return this.repository.findAll();
    }

    async getItemById(id: number): Promise<Item | null> {
        return this.repository.findById(id);
    }

    async createItem(data: CreateItemDTO): Promise<Item> {
        const id = await this.repository.create(data);
        const item = await this.repository.findById(id);
        if (!item) throw new Error('Failed to create item');
        return item;
    }

    async updateItem(id: number, data: UpdateItemDTO): Promise<Item | null> {
        const updated = await this.repository.update(id, data);
        if (!updated) return null;
        return this.repository.findById(id);
    }

    async deleteItem(id: number): Promise<boolean> {
        return this.repository.delete(id);
    }
}
