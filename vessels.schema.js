'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* const additionalName = process.env.NODE_ENV === "test" ? "_test" : "";
const YardsModel = require("../yards/yards.model");
const CargoModel = require("../cargo/cargo.model");
const RegisterClassModel = require("../register-class/register-class.model");
const _ = require("lodash");
const param = require("./paramForSpecialType"); */

const baseDimension = new Schema({
  _id: false,
  value: { type: Number },
  dimension: { type: String },
  name: { type: String },
});

const lbhDimensions = new Schema({
  _id: false,
  l: { type: Number, default: 0 },
  b: { type: Number, default: 0 },
  h: { type: Number, default: 0 },
});

const lbDimensions = new Schema({
  _id: false,
  l: { type: Number, default: 0 },
  b: { type: Number, default: 0 },
});

const sixDimensions = new Schema({
  _id: false,
  // Create Array
  first: lbhDimensions,
  second: lbhDimensions,
  third: lbhDimensions,
  forth: lbhDimensions,
  fifth: lbhDimensions,
  sixth: lbhDimensions,
});

const bunkerInfo = new Schema({
  _id: false,
  quantity: { type: Number },
  typeOfFuel: { type: String }, // "IFO", "IFO 60", "IFO 80", "IFO 120", "IFO 180", "IFO 380", "MDO", "MGO"
});

const consumptionSchema = {
  _id: false,
  speed: { type: Number },
  fuel: [bunkerInfo],
};
const specialTypeSchema = new Schema({
  _id: false,
  ourGroup: { type: String },
  ourType: { type: String },
  dwtGroupName: { type: String },
});

const lessConsumptionSchema = [{ type: bunkerInfo }];

/* const OUR_GROUPS_ALLOWED_FOR_ONROUTE = [
  'mpp',
  'bulk',
  'cont',
  'reefer',
  'livestock',
  'bulktank',
]; */

const VesselSchema = new Schema(
	{
		location: {
			coordinates: [{ type: Number }],
			type: { type: String },
			angle: { type: Number },
			speed: { type: Number },
		},
		lastKnownRoute: {
			progress: { type: Number },
			to: {
				portId: { type: String },
				date: { type: Date },
				name: { type: String },
			},
			from: {
				portId: { type: String },
				date: { type: Date },
				name: { type: String },
			}
		},

    name: { type: String, index: true, required: true },
    lowerName: { type: String },
    imoNumber: { type: String, index: true, required: true, unique: true },
    type: { type: String }, // CONT, ROLO, RORO, SID, TWEEN
    specialType: { type: specialTypeSchema, default: {} },
    blt: { type: Number },
    //flag: { type: Schema.ObjectId, ref: "CountriesModel", select: false },
    //	owner: { type: Schema.ObjectId, ref: "CompaniesModel", select: false },
    //	manager: { type: Schema.ObjectId, ref: "CompaniesModel" },
    class: { type: String },
    //	homePort: { type: Schema.ObjectId, ref: "PortsModel", select: false },
    fullTextSearch: { type: String, select: false },
    gears: {
      type: {
        _id: false,
        summary: [
          {
            category: { type: String }, // "CR", "BT", "DR", "GN", "HC"
            quantity: { type: Number },
            tonnage: { type: Number },
            outreach: { type: Number },
            combinable: { type: Boolean },
          },
        ],
        maxSWL: { type: Number, select: false },
        all: { type: [String] },

        // TODO: remove
        gearDetail: { type: String },
        first: { type: Number, select: false },
        second: { type: Number, select: false },
        third: { type: Number, select: false },
        fourth: { type: Number, select: false },
        fifth: { type: Number, select: false },
        sixth: { type: Number, select: false },
      },
      default: {},
    },
    reeferPlugs: { type: Number, default: 0, select: false },
    description: { type: String },
    fitted: {
      type: {
        _id: false,
        co2: { type: Boolean },
        ice: { type: String },
        strengthened: { type: Boolean },
        ahl: { type: Boolean },
      },
      select: false,
      default: {},
    },
    cargoExclusions: { type: String },
    dw: {
      dwcc: { type: Number, default: 0, select: false },
      summer: { type: Number, default: 0 },
      tropical: { type: Number, default: 0, select: false },
    },
    rt: {
      type: {
        _id: false,
        gt: { type: Number, default: 0 },
        nt: { type: Number, default: 0 },
        panamaNt: { type: Number, default: 0 },
        suezNt: { type: Number, default: 0 },
        suezGt: { type: Number, default: 0 },
      },
      select: false,
      default: {},
    },
    speeds: {
      type: {
        _id: false,
        laden: { type: Number, default: 0 },
        ballast: { type: Number, default: 0 },
        eco: { type: Number, default: 0 }, // it is eco laden speed
        ecoBallast: { type: Number },
      },
      select: false,
      default: {},
    },
    consumptions: {
      type: {
        _id: false,
        tpc: { type: Number, default: 0 },
        tpi: { type: Number, default: 0 },
        windScale: { type: Number, default: 0 },
        laden: lessConsumptionSchema,
        ballast: lessConsumptionSchema,
        eco: lessConsumptionSchema,
        portIdle: lessConsumptionSchema,
        portWorking: lessConsumptionSchema,

        // TODO
        ecoLaden: consumptionSchema,
        ecoBallast: consumptionSchema,
        canal: lessConsumptionSchema,
        portLoad: lessConsumptionSchema,
        portUnLoad: lessConsumptionSchema,
        working24h: lessConsumptionSchema,
      },
      select: false,
      default: {},
    },
    dimensions: {
      type: {
        _id: false,
        loa: { type: Number, default: 0 },
        beam: { type: Number, default: 0 },
        depth: { type: Number, default: 0 },

        // TODO
        lbp: { type: Number },
      },
      select: false,
      default: {},
    },
    capacity: {
      type: {
        _id: false,
        grain: { type: Number, default: 0 },
        bale: { type: Number, default: 0 },
        teu: { type: Number, default: 0 },
        feu: { type: Number, default: 0 },

        // TODO
        timber: { type: baseDimension, select: false },
        ramp: { type: Number, select: false },
        tank: { type: lessConsumptionSchema, select: false },
      },
      default: {},
    },
    holds: {
      type: {
        _id: false,
        quantity: { type: Number, default: 0 },
        lowerDims: [{ type: lbhDimensions }],
        tweenDims: [{ type: lbhDimensions }],

        // TODO
        all: [{ type: Number }],
        boxIndex: { type: String },
        lower: sixDimensions,
      },
      select: false,
      default: {},
    },
    hatches: {
      type: {
        _id: false,
        hatchType: { type: String },
        quantity: { type: Number, default: 0 },
        size: [{ type: lbDimensions }],

        // TODO
        hatchCover: { type: String },
        hatchDescription: { type: String },
        operation: { type: String },
        all: [
          {
            _id: false,
            length: { type: Number },
            width: { type: Number },
          },
        ],
        usual: sixDimensions,
        twd: sixDimensions,
      },
      select: false,
      default: {},
    },
    areas: {
      type: {
        _id: false,
        mainDeck: { type: Number, default: 0 },
        tweenDeck: { type: Number, default: 0 },
        weatherDeck: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      select: false,
      default: {},
    },
    bunkers: {
      type: [
        {
          typeOfFuel: { type: String },
          quantity: { type: Number },
        },
      ],
    },
    strength: {
      type: {
        _id: false,
        maxTt: { type: Number, default: 0 },
        maxTween: { type: Number, default: 0 },
        maxWeather: { type: Number, default: 0 },
      },
      select: false,
      default: {},
    },
    stackWeight: {
      type: {
        _id: false,
        '20hold': { type: Number, default: 0 },
        '20deck': { type: Number, default: 0 },
        '40hold': { type: Number, default: 0 },
        '40deck': { type: Number, default: 0 },
      },
      select: false,
      default: {},
    },
    //images: [{ type: Schema.ObjectId, ref: "FileModel" }],
    //attachments: [{ type: Schema.ObjectId, ref: "FileModel" }],
    //addedBy: { type: Schema.ObjectId, ref: "UsersModel", select: false },
    lastUpdate: {
      type: [
        {
          _id: false,
          //	user: { type: Schema.ObjectId, ref: "UsersModel" },
          time: { type: Date },
        },
      ],
      select: false,
    },
    confirmed: { type: Boolean, default: false, index: 1 },
    deleteAt: { type: Date },
    //deleteBy: { type: Schema.ObjectId, ref: "UsersModel", index: 1 },
    hasKnownLocationSince: {
      type: Date,
    },
    formers: {
      type: {
        _id: false,
        actualToDate: { type: String },
        name: { type: String },
        allHistory: { type: String },
      },
      select: false,
      default: {},
    },
    exNames: [
      {
        name: { type: String },
      },
    ],

    // Not exists on frontend
    area: {
      type: {
        _id: false,
        Aa: { type: Number },
        Ab: { type: Number },
        Ac: { type: Number },
        Ad: { type: Number },
        Ae: { type: Number },
        Af: { type: Number },
        Ag: { type: Number },
        Ah: { type: Number },
        Ai: { type: Number },
        Aj: { type: Number },
        Ak: { type: Number },
        Al: { type: Number },
        Ba: { type: Number },
        Bb: { type: Number },
        Bc: { type: Number },
        Bd: { type: Number },
        Be: { type: Number },
        Bf: { type: Number },
        Bg: { type: Number },
        Bh: { type: Number },
        Bi: { type: Number },
        Bj: { type: Number },
        Bk: { type: Number },
        Bl: { type: Number },
        Ca: { type: Number },
        Cb: { type: Number },
        Cc: { type: Number },
        Cd: { type: Number },
        Ce: { type: Number },
        Cf: { type: Number },
        Cg: { type: Number },
        Ch: { type: Number },
        Ci: { type: Number },
        Cj: { type: Number },
        Ck: { type: Number },
        Cl: { type: Number },
        Da: { type: Number },
        Db: { type: Number },
        Dc: { type: Number },
        Dd: { type: Number },
        De: { type: Number },
        Df: { type: Number },
        Dg: { type: Number },
        Dh: { type: Number },
        Di: { type: Number },
        Dj: { type: Number },
        Dk: { type: Number },
        Dl: { type: Number },
        Ea: { type: Number },
        Eb: { type: Number },
        Ec: { type: Number },
        Ed: { type: Number },
        Ee: { type: Number },
        Ef: { type: Number },
        Eg: { type: Number },
        Eh: { type: Number },
        Fa: { type: Number },
        Fb: { type: Number },
        Fc: { type: Number },
        Fd: { type: Number },
        Fe: { type: Number },
        Ff: { type: Number },
        Fg: { type: Number },
        Fh: { type: Number },
        Ga: { type: Number },
        Gb: { type: Number },
        Gc: { type: Number },
        Gd: { type: Number },
        Ge: { type: Number },
        Gf: { type: Number },
        Gg: { type: Number },
        Gh: { type: Number },
        Ha: { type: Number },
        Hb: { type: Number },
        Hc: { type: Number },
        Hd: { type: Number },
        He: { type: Number },
        Hf: { type: Number },
        Hg: { type: Number },
        Hh: { type: Number },
      },
      select: false,
      default: {},
    },
    draft: { type: Number },
    summerDraft: { type: Number, select: false },
    hullLimit: { type: Number }, // Цена корпуса судна
    engineLocation: { type: String },
    imoClass: { type: String, select: false }, // где можно возить опасные грузы
    ramp: { type: String, select: false },

    // TODO
    vesselType: { type: String },
    vesselGroup: { type: String },
    subType: { type: String },
    built: { type: Date },
    shipDesign: { type: String },
    // ownerCompany: {type: Schema.ObjectId, ref: "CompaniesModel", select: false},

    // ------------------ start v2 fields
    builderV2: {
      //	yard: { type: Schema.ObjectId, ref: "YardsModel" },
      //	country: { type: Schema.ObjectId, ref: "CountriesModel" },
    },
    //registerClass: { type: Schema.ObjectId, ref: "RegisterClassModel" },
    //piClub: { type: Schema.ObjectId, ref: "PIClubModel" },
    iacsRegister: { type: Boolean, default: false },
    typeByPurpose: { type: String, default: '' },
    // , enum: ["MPP", "BULK", "CONT", "TANK", "PASS", "PASSCAR", "REEFER", "CAR", "LIVESTOCK", "BULKTANK"]
    typeByConstruction: { type: String, default: '' },
    openHatch: { type: Boolean, default: false },
    boxShaped: { type: Boolean, default: false },
    geared: { type: Boolean, default: false },
    gearV2: {
      type: {
        _id: false,
        summary: [
          {
            type: { type: String },
            quantity: { type: Number },
            capacity: { type: Number },
            outreach: { type: Number },
            maxSWL: { type: Number },
            combinable: { type: Boolean },
          },
        ],
      },
      default: {},
    },
    grabbed: { type: Boolean, default: false },
    grabV2: {
      type: {
        _id: false,
        summary: [
          {
            type: { type: String },
            quantity: { type: Number },
            volume: { type: Number },
          },
        ],
      },
      default: {},
    },
    techEquipCertificate: {
      type: {
        _id: false,
        co2Fitted: { type: Boolean, default: false },
        a60BulkheadFitted: { type: Boolean, default: false },
        cementHolesFitted: { type: Boolean, default: false },
        referPlugFitted: { type: Boolean, default: false },
        itfFitted: { type: Boolean, default: false },
        lakesFitted: { type: Boolean, default: false },
        strengthenHeavy: { type: Boolean, default: false },
        logsFitted: { type: Boolean, default: false },
        aussieFitted: { type: Boolean, default: false },
        iceClass: { type: String },
        ventilation: { type: String },
        ventilationFitted: { type: Boolean, default: false },
        imoApp: { type: String },
        imoClass: { type: String },
        imoFitted: { type: Boolean, default: false },
      },
      default: {},
    },
    /* 		cargoExclusionsV2: [
					{
						type: Schema.ObjectId,
						ref: "CargoModel",
						default: [],
					},
				], */
    deadWeight: {
      type: {
        _id: false,
        sLoaded: { type: Number },
        sDWT: { type: Number },
        sDWCC: { type: Number },
        sDraft: { type: Number },
        sTpc: { type: Number },
        sTpi: { type: Number },
        tLoaded: { type: Number },
        tDWT: { type: Number },
        tDWCC: { type: Number },
        tDraft: { type: Number },
        tTpc: { type: Number },
        tTpi: { type: Number },
        wLoaded: { type: Number },
        wDWT: { type: Number },
        wDWCC: { type: Number },
        wDraft: { type: Number },
        wTpc: { type: Number },
        wTpi: { type: Number },
        fLoaded: { type: Number },
        fDWT: { type: Number },
        fDWCC: { type: Number },
        fDraft: { type: Number },
        fTpc: { type: Number },
        fTpi: { type: Number },
      },
      default: {},
    },
    tonnage: {
      type: {
        _id: false,
        gt: { type: Number },
        nt: { type: Number },
        suezGt: { type: Number },
        suezNt: { type: Number },
        panamaGt: { type: Number },
        panamaNt: { type: Number },
      },
      default: {},
    },
    dimensionsV2: {
      type: {
        _id: false,
        loa: { type: Number },
        lbp: { type: Number },
        beam: { type: Number },
        depth: { type: Number },
      },
      default: {},
    },
    capacityV2: {
      type: {
        _id: false,
        grain: { type: String },
        bale: { type: String },
        teu: { type: String },
        feu: { type: String },
        summary: {
          type: [
            {
              _id: false,
              hold: {
                grain: { type: Number },
                bale: { type: Number },
                teu: { type: Number },
                feu: { type: Number },
              },
              tweenDeck: {
                grain: { type: Number },
                bale: { type: Number },
                teu: { type: Number },
                feu: { type: Number },
              },
            },
          ],
        },
      },
      default: {},
    },
    holdsV2: {
      type: [
        {
          _id: false,
          l: { type: Number },
          b: { type: Number },
          h: { type: Number },
          area: { type: Number },
        },
      ],
      default: [],
    },
    cells: {
      type: [
        {
          _id: false,
          holds: {
            l: { type: Number },
            b: { type: Number },
            h: { type: Number },
            area: { type: Number },
          },
          tweenDecks: {
            type: [
              {
                _id: false,
                l: { type: Number },
                b: { type: Number },
                h: { type: Number },
                area: { type: Number },
              },
              {
                _id: false,
                l: { type: Number },
                b: { type: Number },
                h: { type: Number },
                area: { type: Number },
              },
            ],
          },
          hatches: [
            {
              _id: false,
              l: { type: Number },
              b: { type: Number },
              area: { type: Number },
            },
            {
              _id: false,
              l: { type: Number },
              b: { type: Number },
              area: { type: Number },
            },
          ],
        },
      ],
      default: [],
    },
    speedConsumptionV2: {
      type: [
        {
          _id: false,
          mode: { type: String },
          speed: { type: Number },
          ifo: {
            type: {
              _id: false,
              typeIfo: { type: String },
              cons: { type: Number },
            },
          },
          mdo: {
            type: {
              _id: false,
              typeMdo: { type: String },
              cons: { type: Number },
            },
          },
        },
      ],
      default: [],
    },

    // ------------------ end v2 fields

    constants: { type: Number },
    tweenDecks: { type: sixDimensions, select: false },
    loadedDisplacement: { type: baseDimension, select: false },
    // cons: {type: {
    //     _id: false,
    //     sea: {
    //         laden: {type: String},
    //         ballast: {type: String},
    //         eco: {type: String}
    //     },
    //     port: {
    //         idle: {type: String},
    //         working: {type: String}
    //     }
    // }, select: false, default: {}},
    mmsi: { type: String },
    callSign: { type: String },
    AISType: { type: String },
    heavyLiftIndex: { type: String },
    selfUnloadIndex: { type: String },

    __v: { type: Number },

    builder: { type: String },
    fromParser: { type: String },
  },
  {
    minimize: false,
    collection: 'VesselsCollection',
  }
);

VesselSchema.index(
  { hasKnownLocationSince: -1 },
  { sparse: true, background: true }
);
VesselSchema.index({ 'dw.summer': 1 });
VesselSchema.index({ 'capacity.grain': -1 });
VesselSchema.index({ 'location': '2dsphere' }, { sparse: true, background: true });

VesselSchema.index({
  fullTextSearch: 'text',
});

module.exports = mongoose.model('VesselsModel', VesselSchema);
