'use strict';
  console.log('Not working? - debugger!');
  // dom object holds repeated dom lookups
  const dom = {
    inputs: document.getElementsByTagName('input'),
    notes: document.getElementById('notes'),
    front: document.getElementById('patternFront'),
    rear: document.getElementById('patternRear'),
    edit: document.getElementById('edit'),
    previous: document.getElementById('previous'),
    next: document.getElementById('next'),
    browse: document.getElementById('browse'),
    load: document.getElementById('load'),
    save: document.getElementById('save')
  };

  /**
   * The wheels object contains the following properties and methods
   * 1. workSheet - an array to hold sheet objects
   * 2. priceList - as the name suggests, list of unit prices
   * 3. sampleData - sample sheets to use during development
   * 4. addSheet - adds a sheet object to the workSheet array
   * 5. calculateLength - the spoke length calculator
   * 6. saveToLocalStorage - saves workSheet to localStorage
   * 7. getArrayIndex - finds index of workSheet given sheet id
   */
  var wheels = {
    workSheet: [],
    priceList: {
      sapimRaceSilver: 0.6,
      sapimStrongSilver: 0.7,
      sapimLeaderSilver: 0.4,
      wheelBuild: 30,
      disassembly: 5,
      spokeHeadWashers: 0.1,
      rimTape: 2.5
    },
    sampleData: '[{"nameOfClient":"Alexander Baxevanis","clientContact":"alex.baxevanis@gmail.com","dateReceived":"2017-02-09","rims":"Rigida Star 19","frontHub":"Sturmey Archer HDS12-DYN HUB","rearHub":"VENTURA","spoke":"","patternFront":"3","patternRear":"3","rimTape":"No","numberOfSpokesFront":"36","numberOfSpokesRear":"36","effectiveRimDiameterFront":"602","effectiveRimDiameterRear":"602","frontLeftCentreToFlange":"29","frontLeftFlangeDiameter":"65","frontLeftHoleDiameter":"3","frontRightCentreToFlange":"29","frontRightFlangeDiameter":"65","frontRightHoleDiameter":"3","rearLeftCentreToFlange":"25","rearLeftFlangeDiameter":"48","rearLeftHoleDiameter":"2.8","rearRightCentreToFlange":"23","rearRightFlangeDiameter":"48","rearRightHoleDiameter":"2.8","notes":"","id":"km6owflxmte7pnc1"},{"nameOfClient":"Mark Childerstone","clientContact":"","dateReceived":"2017-02-06","rims":"Mavic A119","frontHub":"Shimano HB RM70","rearHub":"SRAM Automatix","spoke":"","patternFront":"0","patternRear":"3","rimTape":"","numberOfSpokesFront":"36","numberOfSpokesRear":"36","effectiveRimDiameterFront":"608","effectiveRimDiameterRear":"608","frontLeftCentreToFlange":"34","frontLeftFlangeDiameter":"38","frontLeftHoleDiameter":"2.5","frontRightCentreToFlange":"34","frontRightFlangeDiameter":"38","frontRightHoleDiameter":"2.5","rearLeftCentreToFlange":"25","rearLeftFlangeDiameter":"70","rearLeftHoleDiameter":"3.0","rearRightCentreToFlange":"29","rearRightFlangeDiameter":"70","rearRightHoleDiameter":"3.0","notes":"Spoke washers for the rear wheel","id":"5ofqy3bfmc32s6ap"},{"nameOfClient":"Tim Powell","clientContact":"","dateReceived":"2017-02-06","rims":"Far Sports","frontHub":"White industries T11 Black","rearHub":"White industries T11 Black","spoke":"Sapim CX-Ray Black","patternFront":"0","patternRear":"2","rimTape":"","numberOfSpokesFront":"20","numberOfSpokesRear":"24","effectiveRimDiameterFront":"570","effectiveRimDiameterRear":"570","frontLeftCentreToFlange":"35.5","frontLeftFlangeDiameter":"35.0","frontLeftHoleDiameter":"2.4","frontRightCentreToFlange":"35.5","frontRightFlangeDiameter":"35.0","frontRightHoleDiameter":"2.4","rearLeftCentreToFlange":"37.0","rearLeftFlangeDiameter":"40.0","rearLeftHoleDiameter":"2.4","rearRightCentreToFlange":"16.0","rearRightFlangeDiameter":"53.0","rearRightHoleDiameter":"2.4","notes":"Black nipples","id":"984ulk1o9b7hzk6l"},{"id":"ysfespbyj61appa1","nameOfClient":"Oliver","clientContact":"","dateReceived":"2017-02-01","rims":"Kinlin","frontHub":"SP PV-8","rearHub":"","spoke":"Sapim Strong Black","rimTape":"Yes","numberOfSpokesFront":"32","numberOfSpokesRear":"","effectiveRimDiameterFront":"579","effectiveRimDiameterRear":"","frontLeftCentreToFlange":"23.5","frontLeftFlangeDiameter":"52","frontLeftHoleDiameter":"2.7","frontRightCentreToFlange":"23.5","frontRightFlangeDiameter":"52","frontRightHoleDiameter":"2.7","rearLeftCentreToFlange":"","rearLeftFlangeDiameter":"","rearLeftHoleDiameter":"","rearRightCentreToFlange":"","rearRightFlangeDiameter":"","rearRightHoleDiameter":"","notes":"Wants a couple of spare spokes","patternFront":"3","patternRear":"3"}]',
    addSheet: function(values) {
      // values is an object created by the formHandler method
      this.workSheet.push(values);
    },
    calculateLength: function(wheelset) {
      // set all the variables from a wheelset object
      // wheelset object has 5 properties
    var halfSpokeCount = parseFloat(wheelset.numberOfSpokes) / 2;
    var halfERD = parseFloat(wheelset.effectiveRimDiameter) / 2;
    var centreToFlangeSquared = Math.pow(parseFloat(wheelset.centreToFlange), 2);
    var halfFlangeDiameter = parseFloat(wheelset.flangeDiameter) / 2;
    var halfHoleSize = parseFloat(wheelset.spokeHoleDiameter) / 2;
      var columnA = [];
      for (var i = 0; i < 5; i++) {
        columnA[i] = halfFlangeDiameter*Math.sin(2*Math.PI*i/(halfSpokeCount));
      }
      var columnB = [];
      for (var j = 0; j < 5; j++) {
        columnB[j] = halfERD-((halfFlangeDiameter)*Math.cos(2*Math.PI*j/(halfSpokeCount)));
      }
      var length = [];
      for (var k = 0; k < 5; k++) {
        length[k] = (Math.sqrt(Math.pow(columnA[k],2)
                               +Math.pow(columnB[k],2)
                               +centreToFlangeSquared)
                               -(halfHoleSize)).toFixed(1);
      }
       return length[wheelset.crossNumber];
    },
    saveToLocalStorage: function() {
      // what if the localstorage is empty
      if (localStorage.length === 0 || localStorage.getItem('worksheets') === null) {
        localStorage.setItem('worksheets', '[]');
      }
      // this will save the whole workSheet array to localstorage
      // we don't want to overwrite what is currently stored
      // but add to what is already there
      if (this.workSheet.length > 0) {
        var loadedSheets = JSON.parse(localStorage.getItem('worksheets'));
        var loadedSheetsIDs = [];
        loadedSheets.forEach(function(sheet) {
          loadedSheetsIDs.push(sheet.id);
        });
        this.workSheet.forEach(function(sheet) {
          // we need to check for duplicates - is it already saved to localStorage?
          // if the id of the sheet isn't in the loadedSheets
          if(!loadedSheetsIDs.includes(sheet.id)) {
            loadedSheets.push(sheet);
          }
        })
        localStorage.setItem('worksheets', JSON.stringify(loadedSheets));
      // perhaps some sort of alert that says your data has been saved
      }
    },
    // previous / next buttons need to know where the sheet is located
    /**
     * Finds where the given sheet is in the workSheet array
     * @param {string} sheetID - 16 char string
     * @returns {number} - could also return undefined
     */
    getArrayIndex: function(sheetID) {
      var arrayIndex;
      this.workSheet.forEach(function(sheet, index) {
        if (sheet.id === sheetID) {
          arrayIndex = index;
        }
      });
      return arrayIndex;
    }
  };

/**
 * The formHandlers object contains the following:
 * 1. save - creates a sheet object based on input values
 * 2. newSheet - sets up the inputs ready for new sheet
 * 3. load - load button loads sampleData
 * 4. browse - sets up page for browsing sheets starting at zero
 * 5. next - displays next sheet in workSheet
 * 6. previous - displays previous sheet in workSheet
 */
var formHandlers = {
  // create objects using Object.defineProperty
  // var newObj = Object.defineProperty({},
//            'spokeHoleDiameter',
  //         {value: 2.7, writable: true})
    save: function(event){
      var values = {};
      // dom.inputs is a NodeList
      // Array.from makes it into an array so that we can use forEach
      // now I can use an arbitrary number of inputs
      Array.from(dom.inputs).forEach(function(input) {
      // Object.defineProperty allows property creation
      // Using the element id names properties
        Object.defineProperty(
          values,
          input.id,
          {value: input.value,
           writable: true,
           enumerable: true
          });
      });
      values.notes = dom.notes.value;
      values.patternFront = dom.front.value;
      values.patternRear = dom.rear.value;
      // create a 16 char random string for workSheet ID
      function randomString() {
        let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i=0; i < 16; i++) {
          let randomNumber = Math.floor(Math.random() * chars.length);
          output += chars.charAt(randomNumber);
        }
        return output;
      }
      // assign a 16 character random string as id to object
      values.id = randomString();
      wheels.addSheet(values);
      display.showLengths(wheels.workSheet.length - 1);
      wheels.saveToLocalStorage();
      display.disableButton('save');
      display.disableInputs();
      display.enableButton('edit');
      display.enableButton('browse');
      event.preventDefault();
    },
  newSheet: function() {
    // get hold of all the inputs and set their values to empty string
    // they may also be disabled so enable them
    // also disable other menu buttons except save
    Array.from(dom.inputs).forEach(function (input) {
      input.value = '';
      input.removeAttribute('disabled');
    });
    dom.notes.value = '';
    display.enableButton('front');
    dom.notes.removeAttribute('disabled');
    display.enableButton('rear');
    display.disableButton('edit');
    display.disableButton('previous');
    display.disableButton('next');
    display.disableButton('browse');
    display.disableButton('load');
  },
  load: function(event) {
    localStorage.clear();
    localStorage.setItem('worksheets', wheels.sampleData);
    wheels.workSheet = JSON.parse(localStorage.getItem('worksheets'));
    event.preventDefault();
  },
  browse: function(event) {
    display.disableInputs();
    // should sync and then load but for now will load samples
    formHandlers.load(event);
    display.viewSheet(0);
  },
  next: function(event) {
    var sheetID = document.getElementById('id');
    var currentIndex = wheels.getArrayIndex(sheetID.value);
    if (currentIndex < wheels.workSheet.length - 1) {
      display.viewSheet(currentIndex + 1);
    }
    event.preventDefault();
  },
  previous: function(event) {
    var sheetID = document.getElementById('id');
    var currentIndex = wheels.getArrayIndex(sheetID.value);
    if (currentIndex >= 1) {
      display.viewSheet(currentIndex - 1);
    }
    event.preventDefault();
  },
  edit: function(event) {
    Array.from(dom.inputs).forEach(function (input) {
      input.removeAttribute('disabled');
    });
    dom.notes.removeAttribute('disabled');
    dom.front.removeAttribute('disabled');
    dom.rear.removeAttribute('disabled');
    event.preventDefault();
  }
};
/**
 * The display object contains the following:
 * 1. showLengths - appends lengths to spokes required table
 * 2. disableInputs - for showing data rather than getting
 * 3. clearInputs - sets the value of the inputs to empty
 * 4. viewSheet - displays all the values held in a sheet
 */
var display = {
  showLengths: function(sheetNumber) {
  // will display one set of lengths
  // 4 different lengths need to be calculated
  // calculateLength takes a wheelSet object with 6 properties
  // should have a crossNumber property
    var currentSheet = wheels.workSheet[sheetNumber];
    var frontLeft = {
      crossNumber: currentSheet.patternFront,
      centreToFlange: currentSheet.frontLeftCentreToFlange,
      effectiveRimDiameter: currentSheet.effectiveRimDiameterFront,
      spokeHoleDiameter: currentSheet.frontLeftHoleDiameter,
      flangeDiameter: currentSheet.frontLeftFlangeDiameter,
      numberOfSpokes: currentSheet.numberOfSpokesFront
    }
    var frontRight = {
      crossNumber: currentSheet.patternFront,
      centreToFlange: currentSheet.frontRightCentreToFlange,
      effectiveRimDiameter: currentSheet.effectiveRimDiameterFront,
      spokeHoleDiameter: currentSheet.frontRightHoleDiameter,
      flangeDiameter: currentSheet.frontRightFlangeDiameter,
      numberOfSpokes: currentSheet.numberOfSpokesFront
    }
    var rearLeft = {
      crossNumber: currentSheet.patternRear,
      centreToFlange: currentSheet.rearLeftCentreToFlange,
      effectiveRimDiameter: currentSheet.effectiveRimDiameterRear,
      spokeHoleDiameter: currentSheet.rearLeftHoleDiameter,
      flangeDiameter: currentSheet.rearLeftFlangeDiameter,
      numberOfSpokes: currentSheet.numberOfSpokesRear
    }
    var rearRight = {
      crossNumber: currentSheet.patternRear,
      centreToFlange: currentSheet.rearRightCentreToFlange,
      effectiveRimDiameter: currentSheet.effectiveRimDiameterRear,
      spokeHoleDiameter: currentSheet.rearRightHoleDiameter,
      flangeDiameter: currentSheet.rearRightFlangeDiameter,
      numberOfSpokes: currentSheet.numberOfSpokesRear
    }

    var  wheelSpecs = [frontLeft, frontRight, rearLeft, rearRight];
    var spokeLengths = [];
    wheelSpecs.forEach(function(spec) {
      spokeLengths.push(wheels.calculateLength(spec));
    });
    var spokeTable = Array.from(document.getElementById('lengths').getElementsByTagName('td'));
    for (let i = 1, j = 0; i < spokeTable.length, j < spokeLengths.length; i+=3, j++) {
      // handle the case of front or rear wheel only
      if(isNaN(spokeLengths[j])) {
        spokeTable[i].innerText = '';
      } else {
        spokeTable[i].innerText = spokeLengths[j];
      }
      if(wheelSpecs[j].numberOfSpokes / 2 === 0) {
        spokeTable[i + 1].innerText = '';
      } else {
        spokeTable[i + 1].innerText = wheelSpecs[j].numberOfSpokes / 2;
      }
    }
  },
  disableInputs: function() {
    Array.from(dom.inputs).forEach(function (input) {
      input.setAttribute('disabled', 'disabled');
    });
    dom.notes.setAttribute('disabled', 'disabled');
    dom.front.setAttribute('disabled', 'disabled');
    dom.rear.setAttribute('disabled', 'disabled');
  },
  clearInputs: function() {
    Array.from(dom.inputs).forEach(function(input) {
      input.value = '';
    });
    dom.notes.value = '';
  },
  // displays a sheet
  viewSheet: function(sheetNumber) {
    var currentSheet = wheels.workSheet[sheetNumber];
    Array.from(dom.inputs).forEach(function (input) {
      input.value = currentSheet[input.id];
    });
    dom.notes.value =  currentSheet['notes'];
    dom.front.options[currentSheet.patternFront].setAttribute('selected', true);
    dom.rear.options[currentSheet.patternRear].setAttribute('selected', true);
    this.showLengths(sheetNumber);
  },
  disableButton: function(button) {
    // buttons are looked up in the dom object
    // button arg will be dom.buttonName
     dom[button].setAttribute('disabled', 'disabled');
  },
  enableButton: function(button) {
    dom[button].removeAttribute('disabled');
  }
};
/*
TODO for pure js version
[done] create a calculate function
create a form validation function called when you save
[done] create an area to display results

Before developing the Spoke Length Calculator further
What I want is to create a digital version of my workSheet
- it should look similar (but not identical) to it
- it should allow entry of same data as workSheet
- it should allow you to 'turn' pages
- it should allow you to edit pages
- [done] it should allow you to save pages to storage
- it should allow searching of pages
- it should have some data for parts

// use placeholder text to save space
// use an object for priceList
// save function should save that workSheet and do a cost and spoke length calculation. Then add to local storage
[done] with all the extra data should wheelSet objects now be called workSheet?
// have a look at Bootstrap validations
// buttons should be disabled when they just repeat the current action such as saving the same data multiple times
// should workSheet objects have unique ids? For example when you edit or is array index enough?
// Fields should be disabled in browse mode but enabled in edit mode


- [done] remove old hub fields and set up new 3 x 3 grid to accupt values
- [done] refactor calculator to accept cross parameter
- [done] display should fill 4 calculations
- should workSheet objects hold calculation data repeat each time?
- create a calculation for the costs
- create a jquery.ajax way to save and load data
*/
