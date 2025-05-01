import {
  ElectricalBalanceType,
  ElectricalBalanceDetails,
} from './electrical-balance.type';

describe('ElectricalBalanceType', () => {
  it('should be defined', () => {
    expect(ElectricalBalanceType).toBeDefined();
  });

  it('should have the correct structure', () => {
    const instance = new ElectricalBalanceType();

    // Verify expected properties exist on the class
    expect(instance).toHaveProperty('_id', undefined);
    expect(instance).toHaveProperty('timestamp', undefined);
    expect(instance).toHaveProperty('generation', undefined);
    expect(instance).toHaveProperty('demand', undefined);
    expect(instance).toHaveProperty('imports', undefined);
    expect(instance).toHaveProperty('exports', undefined);
    expect(instance).toHaveProperty('balance', undefined);
    expect(instance).toHaveProperty('details', undefined);
  });
});

describe('ElectricalBalanceDetails', () => {
  it('should be defined', () => {
    expect(ElectricalBalanceDetails).toBeDefined();
  });

  it('should have the correct structure', () => {
    const instance = new ElectricalBalanceDetails();

    // Verify expected properties exist on the class
    expect(instance).toHaveProperty('renewable', undefined);
    expect(instance).toHaveProperty('nonRenewable', undefined);
    expect(instance).toHaveProperty('storage', undefined);
    expect(instance).toHaveProperty('nuclear', undefined);
    expect(instance).toHaveProperty('hydro', undefined);
    expect(instance).toHaveProperty('wind', undefined);
    expect(instance).toHaveProperty('solar', undefined);
    expect(instance).toHaveProperty('thermal', undefined);
  });
});
