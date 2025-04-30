export declare class REEDataValue {
    value: number;
    percentage: number;
    datetime: string;
}
export declare class REEDataAttributes {
    title: string;
    description?: string;
    color?: string;
    icon?: string | null;
    type?: string;
    magnitude?: string | null;
    composite?: boolean;
    'last-update': string;
    values: REEDataValue[];
    total: number;
    'total-percentage': number;
}
export declare class REEDataContent {
    type: string;
    id: string;
    groupId?: string;
    attributes: REEDataAttributes;
}
export declare class REEDataAttributesWrapper {
    title: string;
    'last-update': string;
    description?: string;
    magnitude?: string | null;
    content: REEDataContent[];
}
export declare class REEDataItem {
    type: string;
    id: string;
    attributes: REEDataAttributesWrapper;
}
export declare class REEMetaCacheControl {
    cache: string;
    expireAt: string;
}
export declare class REEMeta {
    'cache-control': REEMetaCacheControl;
}
export declare class REEData {
    type: string;
    id: string;
    attributes: {
        title: string;
        'last-update': string;
        description: string;
    };
    meta: REEMeta;
}
export declare class REEApiResponse {
    data: REEData;
    included: REEDataItem[];
}
