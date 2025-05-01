// Mock data for electrical balance tests
export const mockDate = new Date('2024-01-01T00:00:00.000Z');

// Mock balance object
export const mockBalance = {
  timestamp: mockDate,
  generation: 1000,
  demand: 900,
  imports: 100,
  exports: 200,
  balance: 0,
  details: {
    renewable: 600,
    nonRenewable: 400,
    nuclear: 200,
    hydro: 100,
    wind: 300,
    solar: 200,
    thermal: 200,
    storage: 0
  }
};

// Mock REE API response
export const mockREEData = {
  data: {
    type: 'Balance de energía eléctrica',
    id: 'bal1',
    attributes: {
      title: 'Balance de energía eléctrica',
      'last-update': '2025-01-28T18:25:35.000+01:00',
      description: 'Balance eléctrico: asignación de unidades de producción según combustible principal.'
    }
  },
  included: [
    {
      type: 'Renovable',
      id: 'Renovable',
      attributes: {
        title: 'Renovable',
        content: [
          {
            type: 'Hidráulica',
            attributes: {
              values: [
                {
                  value: 4063907.231,
                  datetime: '2024-04-01T00:00:00.000+02:00'
                }
              ]
            }
          },
          {
            type: 'Eólica',
            attributes: {
              values: [
                {
                  value: 4705864.428,
                  datetime: '2024-04-01T00:00:00.000+02:00'
                }
              ]
            }
          },
          {
            type: 'Solar fotovoltaica',
            attributes: {
              values: [
                {
                  value: 4027609.21,
                  datetime: '2024-04-01T00:00:00.000+02:00'
                }
              ]
            }
          }
        ]
      }
    },
    {
      type: 'No-Renovable',
      id: 'No-Renovable',
      attributes: {
        title: 'No-Renovable',
        content: [
          {
            type: 'Nuclear',
            attributes: {
              values: [
                {
                  value: 3525863.763,
                  datetime: '2024-04-01T00:00:00.000+02:00'
                }
              ]
            }
          }
        ]
      }
    },
    {
      type: 'Demanda',
      id: 'Demanda en b.c.',
      attributes: {
        title: 'Demanda',
        content: [
          {
            type: 'Demanda en b.c.',
            attributes: {
              values: [
                {
                  value: 19292564.304,
                  datetime: '2024-04-01T00:00:00.000+02:00'
                }
              ]
            }
          }
        ]
      }
    }
  ]
}; 