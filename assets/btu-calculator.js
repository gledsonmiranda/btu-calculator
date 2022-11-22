const input = {
  meter: 10,
  people: 3,
  window: 4,
  appliance: 6,
};

var btuCalculatorData = {
  wattsReferenceNumber: 0.2929,
  areas: [
    { area: 10, residencial: 7000, comercial: 7000 },
    { area: 12, residencial: 7000, comercial: 9000 },
  ],
  morningSun: [{ meter: 10, btu: 6000, watts: 1757.4 }],
  allDaySun: [{ meter: 10, btu: 8000, watts: 2343.2 }],
  people: { watts: 174.45 },
  window: { watts: 581.5 },
  appliance: { watts: 1.00018 },
  btuByReference: [
    {reference: 11000, value: 9000},
    {reference: 14000, value: 12000},
    {reference: 20000, value: 18000},
    {reference: 26000, value: 24000},
    {reference: 32000, value: 30000},
  ]
};

var btuCalculator = {
  getMorningSunWatts: (meter) => {
    return btuCalculatorData.morningSun.filter(
      (meterItem) => meterItem.meter === meter
    )[0].watts;
  },
  getAllDaySunWatts: (meter) => {
    return btuCalculatorData.allDaySun.filter(
      (meterItem) => meterItem.meter === meter
    )[0].watts;
  },
  getPeopleWatts: (quantity) => {
    return btuCalculatorData.people.watts * quantity;
  },
  getWindowWatts: (quantity) => {
    return btuCalculatorData.window.watts * quantity;
  },
  getApplianceWatts: (quantity) => {
    return btuCalculatorData.appliance.watts * quantity;
  },
  sumWatts: (data, allDay) => {
    let dataWatts = Object.assign({}, data);

    if (allDay) {
      delete dataWatts.morningSun;
    } else {
      delete dataWatts.allDaySun;
    }

    const watts = Object.values(dataWatts);

    return watts.reduce((accumulator, watt) => accumulator + watt, 0);
  },
  btuCalcFormat: (value) => {
    return Number((value / btuCalculatorData.wattsReferenceNumber).toFixed(0));
  },
  showResult: (result) => {
    document.querySelector('.result').textContent = result;
  },
  getBtuByReference: (referenceNumber) => {
    const btuReference = btuCalculatorData.btuByReference.filter(btu => referenceNumber <= btu.reference);

    return btuReference[0].value;
  },
  init: () => {
    const morningSun = btuCalculator.getMorningSunWatts(input.meter);
    const allDaySun = btuCalculator.getAllDaySunWatts(input.meter);
    const people = btuCalculator.getPeopleWatts(input.people);
    const window = btuCalculator.getWindowWatts(input.window);
    const appliance = btuCalculator.getApplianceWatts(input.appliance);

    const dataWatts = {
      morningSun,
      allDaySun,
      people,
      window,
      appliance,
    };

    const resultWatts = {
      morningSun: btuCalculator.sumWatts(dataWatts, false),
      morningSunWatts: btuCalculator.btuCalcFormat(btuCalculator.sumWatts(dataWatts, false)),
      allDaySun: btuCalculator.sumWatts(dataWatts, true),
      allDaySunWatts: btuCalculator.btuCalcFormat(btuCalculator.sumWatts(dataWatts, true))
    };

    const resultBtus = {
      morningSun: btuCalculator.getBtuByReference(resultWatts.morningSunWatts),
      allDaySun: btuCalculator.getBtuByReference(resultWatts.allDaySunWatts)
    }

    console.log(dataWatts);
    console.log('resultWatts', resultWatts);
    console.log('resultBtus', resultBtus);
    //btuCalculator.showResult('result');
  },
};

btuCalculator.init();
