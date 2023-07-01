import { ItemDTO } from "./ItemDTO";
import { PriceInDTO } from "./PriceInDTO";
import { TraderDTO } from "./TraderDTO";
 
export interface InventoryDTO {
    id: number;
    itemId: number;
    patchId: number | null;
    numberOfUnits: number | null;
    priceInId: number | null;
    traderId: number | null;
    itemDTO: ItemDTO | null;
    priceInDTO: PriceInDTO | null;
    arrivalDate: Date;
    manufacturingDate: Date;
    expirationDate: Date;
    trader: TraderDTO | null;
}