import {
  REEApiResponse,
  REEData,
  REEDataItem,
  REEDataContent,
  REEDataAttributes,
  REEDataValue,
  REEMeta,
  REEMetaCacheControl,
  REEDataAttributesWrapper,
} from './ree-api-response.dto';

describe('REE API Response DTOs', () => {
  describe('REEDataValue', () => {
    it('should create a valid REEDataValue instance', () => {
      const dataValue = new REEDataValue();
      dataValue.value = 1000;
      dataValue.percentage = 25.5;
      dataValue.datetime = '2023-08-01T12:00:00Z';

      expect(dataValue).toBeDefined();
      expect(dataValue.value).toBe(1000);
      expect(dataValue.percentage).toBe(25.5);
      expect(dataValue.datetime).toBe('2023-08-01T12:00:00Z');
    });
  });

  describe('REEDataAttributes', () => {
    it('should create a valid REEDataAttributes instance', () => {
      const dataAttributes = new REEDataAttributes();
      dataAttributes.title = 'Renewable';
      dataAttributes.description = 'Renewable energy sources';
      dataAttributes.color = '#00FF00';
      dataAttributes.icon = 'wind';
      dataAttributes.type = 'energy';
      dataAttributes.magnitude = 'MW';
      dataAttributes.composite = false;
      dataAttributes['last-update'] = '2023-08-01T12:00:00Z';
      dataAttributes.values = [new REEDataValue()];
      dataAttributes.total = 5000;
      dataAttributes['total-percentage'] = 65.5;

      expect(dataAttributes).toBeDefined();
      expect(dataAttributes.title).toBe('Renewable');
      expect(dataAttributes.description).toBe('Renewable energy sources');
      expect(dataAttributes.values).toHaveLength(1);
      expect(dataAttributes.total).toBe(5000);
      expect(dataAttributes['total-percentage']).toBe(65.5);
    });
  });

  describe('REEDataContent', () => {
    it('should create a valid REEDataContent instance', () => {
      const dataContent = new REEDataContent();
      dataContent.type = 'energy-source';
      dataContent.id = 'renewable';
      dataContent.groupId = 'main';
      dataContent.attributes = new REEDataAttributes();

      expect(dataContent).toBeDefined();
      expect(dataContent.type).toBe('energy-source');
      expect(dataContent.id).toBe('renewable');
      expect(dataContent.groupId).toBe('main');
      expect(dataContent.attributes).toBeInstanceOf(REEDataAttributes);
    });
  });

  describe('REEDataAttributesWrapper', () => {
    it('should create a valid REEDataAttributesWrapper instance', () => {
      const wrapper = new REEDataAttributesWrapper();
      wrapper.title = 'Energy Balance';
      wrapper['last-update'] = '2023-08-01T12:00:00Z';
      wrapper.description = 'Energy balance data';
      wrapper.magnitude = 'MW';
      wrapper.content = [new REEDataContent()];

      expect(wrapper).toBeDefined();
      expect(wrapper.title).toBe('Energy Balance');
      expect(wrapper['last-update']).toBe('2023-08-01T12:00:00Z');
      expect(wrapper.content).toHaveLength(1);
    });
  });

  describe('REEDataItem', () => {
    it('should create a valid REEDataItem instance', () => {
      const dataItem = new REEDataItem();
      dataItem.type = 'balance';
      dataItem.id = 'energy-balance';
      dataItem.attributes = new REEDataAttributesWrapper();

      expect(dataItem).toBeDefined();
      expect(dataItem.type).toBe('balance');
      expect(dataItem.id).toBe('energy-balance');
      expect(dataItem.attributes).toBeInstanceOf(REEDataAttributesWrapper);
    });
  });

  describe('REEMetaCacheControl', () => {
    it('should create a valid REEMetaCacheControl instance', () => {
      const cacheControl = new REEMetaCacheControl();
      cacheControl.cache = 'public';
      cacheControl.expireAt = '2023-08-01T13:00:00Z';

      expect(cacheControl).toBeDefined();
      expect(cacheControl.cache).toBe('public');
      expect(cacheControl.expireAt).toBe('2023-08-01T13:00:00Z');
    });
  });

  describe('REEMeta', () => {
    it('should create a valid REEMeta instance', () => {
      const meta = new REEMeta();
      meta['cache-control'] = new REEMetaCacheControl();

      expect(meta).toBeDefined();
      expect(meta['cache-control']).toBeInstanceOf(REEMetaCacheControl);
    });
  });

  describe('REEData', () => {
    it('should create a valid REEData instance', () => {
      const data = new REEData();
      data.type = 'data';
      data.id = 'main-data';
      data.attributes = {
        title: 'Main Data',
        'last-update': '2023-08-01T12:00:00Z',
        description: 'Main data description',
      };
      data.meta = new REEMeta();

      expect(data).toBeDefined();
      expect(data.type).toBe('data');
      expect(data.id).toBe('main-data');
      expect(data.attributes.title).toBe('Main Data');
      expect(data.meta).toBeInstanceOf(REEMeta);
    });
  });

  describe('REEApiResponse', () => {
    it('should create a valid REEApiResponse instance', () => {
      const response = new REEApiResponse();
      response.data = new REEData();
      response.included = [new REEDataItem()];

      expect(response).toBeDefined();
      expect(response.data).toBeInstanceOf(REEData);
      expect(response.included).toHaveLength(1);
      expect(response.included[0]).toBeInstanceOf(REEDataItem);
    });
  });
});
