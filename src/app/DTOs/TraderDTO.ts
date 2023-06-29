import { InventoryDTO } from "./InventoryDTO";

export interface TraderDTO {
    id: number;
    name: string;
    mobileNumber: string | null;
    email: string | null;
    inventories: InventoryDTO[] | null;
}