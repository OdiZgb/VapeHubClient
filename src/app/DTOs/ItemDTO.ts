import { CategoryDTO } from "./CategoryDTO";
import { ItemImageDTO } from "./ItemImageDTO";
import { MarkaDTO } from "./MarkaDTO";
import { PriceInDTO } from "./PriceInDTO";
import { PriceOutDTO } from "./PriceOutDTO";

export interface ItemDTO {
  id: number;
  name: string;
  barcode: string;
  itemsImageDTOs?: ItemImageDTO[] | null;
  markaDTO?: MarkaDTO,
  categoryDTO?: CategoryDTO,
  priceOutDTO?: PriceOutDTO,
  priceInDTO?: PriceInDTO,
}