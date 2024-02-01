import type { SupportImageSource } from "./WorkStoreType";

export interface Layer {
    name: string;
    visibility: boolean;
    source: SupportImageSource;
}