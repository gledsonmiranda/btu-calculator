const btuCalculatorData = {
  wattsReferenceNumber: 0.2929,
  morningSunReference: 600,
  allDaySunReference: 800,
  peopleWatts: 174.45,
  windowWatts: 581.5,
  applianceWatts: 1.00018,
  btuByReference: [
    {reference: 11000, value: 9000},
    {reference: 14000, value: 12000},
    {reference: 20000, value: 18000},
    {reference: 26000, value: 24000},
    {reference: 32000, value: 30000},
  ]
};

const btuCalculator = {
  getMorningSunWatts: (meter) => {
    let btu = meter * btuCalculatorData.morningSunReference;

    return btu * btuCalculatorData.wattsReferenceNumber;
  },
  getAllDaySunWatts: (meter) => {
    let btu = meter * btuCalculatorData.allDaySunReference;

    return btu * btuCalculatorData.wattsReferenceNumber;
  },
  getPeopleWatts: (quantity) => {
    return btuCalculatorData.peopleWatts * quantity;
  },
  getWindowWatts: (quantity) => {
    return btuCalculatorData.windowWatts * quantity;
  },
  getApplianceWatts: (quantity) => {
    return btuCalculatorData.applianceWatts * quantity;
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
    document.querySelector('.result').innerHTML = result;
  },
  getBtuByReference: (referenceNumber) => {
    const btuReference = btuCalculatorData.btuByReference.filter(btu => referenceNumber <= btu.reference);

    return btuReference[0].value;
  },
  loadFormData: () => {
    const formData = {
      meter: Number(document.querySelector('select[name="meter"]').value),
      people: Number(document.querySelector('select[name="people"]').value),
      window: Number(document.querySelector('select[name="window"]').value),
      appliance: Number(document.querySelector('select[name="appliance"]').value),
    }

    return formData;
  },
  init: (input) => {
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

    console.log('dataWatts', dataWatts);
    console.log('resultWatts', resultWatts);
    console.log('resultBtus', resultBtus);

    btuCalculator.showResult(`
      <div class="item">
        <span class="title">W/h:</span>
        <p>sol da manhã: <strong>${resultWatts.morningSun}</strong></p>
        <p>sol dia todo: <strong>${resultWatts.allDaySun}</strong></p>
      </div>
      <div class="item">
        <span class="title">btus:</span>
        <p>sol da manhã: <strong>${resultBtus.morningSun}</strong></p>
        <p>sol dia todo: <strong>${resultBtus.allDaySun}</strong></p>
      </div>
    `);
  },
};

let formBtu = document.getElementById('form-btu');

if (formBtu) {
  formBtu.addEventListener('change', (e) => {
    e.preventDefault();

    let formData = btuCalculator.loadFormData();
    btuCalculator.init(formData);
  });

  let formData = btuCalculator.loadFormData();
  btuCalculator.init(formData);
}
