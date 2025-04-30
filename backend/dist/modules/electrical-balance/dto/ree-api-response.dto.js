"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REEApiResponse = exports.REEData = exports.REEMeta = exports.REEMetaCacheControl = exports.REEDataItem = exports.REEDataAttributesWrapper = exports.REEDataContent = exports.REEDataAttributes = exports.REEDataValue = void 0;
class REEDataValue {
    value;
    percentage;
    datetime;
}
exports.REEDataValue = REEDataValue;
class REEDataAttributes {
    title;
    description;
    color;
    icon;
    type;
    magnitude;
    composite;
    'last-update';
    values;
    total;
    'total-percentage';
}
exports.REEDataAttributes = REEDataAttributes;
class REEDataContent {
    type;
    id;
    groupId;
    attributes;
}
exports.REEDataContent = REEDataContent;
class REEDataAttributesWrapper {
    title;
    'last-update';
    description;
    magnitude;
    content;
}
exports.REEDataAttributesWrapper = REEDataAttributesWrapper;
class REEDataItem {
    type;
    id;
    attributes;
}
exports.REEDataItem = REEDataItem;
class REEMetaCacheControl {
    cache;
    expireAt;
}
exports.REEMetaCacheControl = REEMetaCacheControl;
class REEMeta {
    'cache-control';
}
exports.REEMeta = REEMeta;
class REEData {
    type;
    id;
    attributes;
    meta;
}
exports.REEData = REEData;
class REEApiResponse {
    data;
    included;
}
exports.REEApiResponse = REEApiResponse;
//# sourceMappingURL=ree-api-response.dto.js.map