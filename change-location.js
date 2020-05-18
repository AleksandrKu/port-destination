'use strict';
const https = require('https');
const http = require('http');
const baseUrl = 'shipnext.com';

const getVesselsFromDev = (limit = 5, page = 1, tokenDev) => {
  const options = {
    hostname: 'test.shipnext.com',
    port: 443,
    path: '/api/v1/deck/vessel',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: tokenDev,
    },
  };

  let listOfVessels = '';
  const data = JSON.stringify({
    limit,
    page,
    sort: { field: 'updateAt', value: -1 },
    channels: { mine: true, broker: true, market: true },
    allChannelFiltersApplied: true,
    channelQuery: {
      $or: [
        {
          $and: [
            {
              $or: [
                {
                  source: { $exists: false },
                  endAt: { $gt: '2020-04-22T10:52:47.240Z' },
                  clonedFromBroker: { $exists: false },
                },
                {
                  'freightRequests.cargoSide.user': {
                    $in: [
                      '59b6b447f1640012e129b6eb',
                      '5bebe91691b15a06b65b93b6',
                      '5c9de08fdedf8a62dca89c5d',
                      '5cd008c7bedb8806dc225d2b',
                      '5cd00dc9bedb8806dc2263ea',
                      '5d8399227502766109ae30f7',
                      '5e73a2bf15ada53e5022917c',
                    ],
                  },
                  clonedFromBroker: { $ne: '59b6b447f1640012e129b6ea' },
                },
                {
                  'offersRequests.cargoSide.user': {
                    $in: [
                      '59b6b447f1640012e129b6eb',
                      '5bebe91691b15a06b65b93b6',
                      '5c9de08fdedf8a62dca89c5d',
                      '5cd008c7bedb8806dc225d2b',
                      '5cd00dc9bedb8806dc2263ea',
                      '5d8399227502766109ae30f7',
                      '5e73a2bf15ada53e5022917c',
                    ],
                  },
                  clonedFromBroker: { $ne: '59b6b447f1640012e129b6ea' },
                },
              ],
            },
            {
              addedBy: {
                $nin: [
                  '59b6b447f1640012e129b6eb',
                  '5bebe91691b15a06b65b93b6',
                  '5c9de08fdedf8a62dca89c5d',
                  '5cd008c7bedb8806dc225d2b',
                  '5cd00dc9bedb8806dc2263ea',
                  '5d8399227502766109ae30f7',
                  '5e73a2bf15ada53e5022917c',
                ],
              },
            },
            { source: { $ne: 'company:59b6b447f1640012e129b6ea' } },
          ],
        },
        { $and: [{ source: 'company:59b6b447f1640012e129b6ea' }] },
        {
          $and: [
            {
              addedBy: {
                $in: [
                  '59b6b447f1640012e129b6eb',
                  '5bebe91691b15a06b65b93b6',
                  '5c9de08fdedf8a62dca89c5d',
                  '5cd008c7bedb8806dc225d2b',
                  '5cd00dc9bedb8806dc2263ea',
                  '5d8399227502766109ae30f7',
                  '5e73a2bf15ada53e5022917c',
                ],
              },
            },
            { source: { $exists: false } },
          ],
        },
      ],
    },
  });
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      res.on('data', chunk => {
        listOfVessels += chunk;
      });
      res.on('end', () => {
        const vessels = JSON.parse(listOfVessels);
        if (vessels.status === 200) {
          const imoList = vessels.data.map(vessel => ({ imoNumber: vessel.imoNumber, id: vessel._id }));
          resolve(imoList);
        } else if (vessels.errors) {
          reject(vessels.errors);
        }
      });
    });
    req.on('error', error => {
      console.error(error);
      reject(error);
    });
    req.write(data);
    req.end();
  });
};

const getVesselLocation = (imoNumber, tokenProd) => {
  const path = '/api/v1/vessels/location/' + imoNumber;
  const options = {
    hostname: baseUrl,
    port: 443,
    path,
    method: 'GET',
    headers: { Cookie: tokenProd },
  };

  let vesselLocation = '';
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      res.on('data', chunk => {
        vesselLocation += chunk;
      });
      res.on('end', () => {
        vesselLocation = JSON.parse(vesselLocation);
        try {
          resolve(vesselLocation);
        } catch (error) {
          console.log('Bad vessel IMO. Will not compare!!!  No in shipnextDatabase: ', imoNumber);
          reject(String(error));
        }
      });
    });
    req.on('error', error => {
      console.error(error);
      reject(String(error));
    });
    req.end();
  });
};

const getVesselById = (id, tokenDev) => {
  const path = '/api/v1/vessels/' + id;
  const options = {
    hostname: 'test.shipnext.com',
    port: 443,
    path,
    method: 'GET',
    headers: { Cookie: tokenDev },
  };

  let vessel = '';
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      res.on('data', chunk => {
        vessel += chunk;
      });
      res.on('end', () => {
        try {
          const objectResponse = JSON.parse(vessel);
          const { name, imoNumber, blt, flag, type } = objectResponse.data;
          resolve({ name, imoNumber, blt, flag: flag._id, type, id });
        } catch (error) {
          console.log('Bad vessel Id. Will not compare!!!  No in shipnextDev: ', error);
          reject(String(error));
        }
      });
    });
    req.on('error', error => {
      console.error(error);
      reject(String(error));
    });
    req.end();
  });
};

const updateVesselLocationByApi = (vessel, location, tokenDev) =>
  new Promise((resolve, reject) => {
    const body = {
      confirmed: true,
      name: vessel.name,
      imoNumber: vessel.imoNumber,
      blt: vessel.blt,
      flag: vessel.flag,
      type: vessel.type,
      lastKnownRoute: {
        progress: location.route.progress,
        to: {
          portId: location.route.to.portId,
          date: location.route.to.date,
          name: location.route.to.name,
        },
        from: {
          portId: location.route.from.portId,
          date: location.route.from.date,
          name: location.route.from.name,
        },
      },
      location: {
        coordinates: location.lastPos.coords,
        type: 'Point',
        angle: location.lastPos.angle ? location.lastPos.angle : 0,
        speed: location.lastPos.speed ? location.lastPos.speed : 0,
      },
    };
    const options = {
      hostname: '35.157.166.227',
      port: 5001,
      path: `/api/v1/vessels/${vessel.id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: tokenDev,
      },
    };
    const data = JSON.stringify(body);
    let response;
    const req = http.request(options, res => {
      res.on('data', chunk => (response += chunk));
      res.on('end', () => {
        if (response.includes('Vessel update successful')) {
          resolve(vessel.imoNumber);
        } else {
          resolve(false);
        }
      });
    });
    req.on('error', error => {
      console.error(error);
      reject(String(error));
    });
    req.write(data);
    req.end();
  });

const changeLocation = async (tokenDev, tokenProd, limit = 5, page = 1) => {
  const start = Date.now();
  let imoIndex = 0;
  let imos;
  const successImos = [];
  try {
    imos = await getVesselsFromDev(limit, page, tokenDev);
    console.log({ imos });
  } catch (err) {
    console.log(err);
    return err;
  }
  do {
    try {
      const vesselLocation = await getVesselLocation(imos[imoIndex].imoNumber, tokenProd);
      const vesselInfo = await getVesselById(imos[imoIndex].id, tokenDev);
      const changeLocation = await updateVesselLocationByApi(vesselInfo, vesselLocation, tokenDev);
      if (changeLocation) {
        successImos.push(changeLocation);
        console.log(changeLocation);
      }
    } catch (error) {
      console.log('Error in imoNumber: ', imos[imoIndex]);
      console.log(String(error));
      continue;
    }
    imoIndex++;
  } while (imoIndex < limit);
  console.log(successImos.length, String(successImos));
  const end = Date.now();
  const diff = (end - start) / 1000;
  console.log('Time request of ' + imoIndex + ' = ' + diff + ' seconds');
  return String(successImos);
};

module.exports = {
  changeLocation,
};
