export class REEDataValue {
  value: number;
  percentage: number;
  datetime: string;
}

export class REEDataAttributes {
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

export class REEDataContent {
  type: string;
  id: string;
  groupId?: string;
  attributes: REEDataAttributes;
}

export class REEDataAttributesWrapper {
  title: string;
  'last-update': string;
  description?: string;
  magnitude?: string | null;
  content: REEDataContent[];
}

export class REEDataItem {
  type: string;
  id: string;
  attributes: REEDataAttributesWrapper;
}

export class REEMetaCacheControl {
  cache: string;
  expireAt: string;
}

export class REEMeta {
  'cache-control': REEMetaCacheControl;
}

export class REEData {
  type: string;
  id: string;
  attributes: {
    title: string;
    'last-update': string;
    description: string;
  };
  meta: REEMeta;
}

export class REEApiResponse {
  data: REEData;
  included: REEDataItem[];
} 