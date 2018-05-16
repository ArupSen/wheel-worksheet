  console.log('Not working? - debugger!');
  // wheels object will hold wheelset data
  // methods to manipulate that array
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
    sampleData: '[{"nameOfClient":"Alexander Baxevanis","clientContact":"alex.baxevanis@gmail.com","dateReceived":"2017-02-09","rims":"Rigida Star 19","frontHub":"Sturmey Archer HDS12-DYN HUB","rearHub":"VENTURA","spoke":"","patternFront":"3","patternRear":"3","rimTape":"No","numberOfSpokesFront":"36","numberOfSpokesRear":"36","effectiveRimDiameterFront":"602","effectiveRimDiameterRear":"602","frontLeftCentreToFlange":"29","frontLeftFlangeDiameter":"65","frontLeftHoleDiameter":"3","frontRightCentreToFlange":"29","frontRightFlangeDiameter":"65","frontRightHoleDiameter":"3","rearLeftCentreToFlange":"25","rearLeftFlangeDiameter":"48","rearLeftHoleDiameter":"2.8","rearRightCentreToFlange":"23","rearRightFlangeDiameter":"48","rearRightHoleDiameter":"2.8","notes":""}]',
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
        this.workSheet.forEach(function(sheet) {
        loadedSheets.push(sheet);
        })
        localStorage.setItem('worksheets', JSON.stringify(loadedSheets));
      // perhaps some sort of alert that says your data has been saved
      }
    }
  };

var formHandlers = {
  // create objects using Object.defineProperty
  // var newObj = Object.defineProperty({},
//            'spokeHoleDiameter',
  //         {value: 2.7, writable: true})
    save: function(event){
      var values = {};
      var inputs = document.getElementsByTagName('input');
      // inputs is a NodeList
      // Array.from makes it into an array so that we can use forEach
      // now I can use an arbitrary number of inputs
      Array.from(inputs).forEach(function(elem) {
      // Object.defineProperty allows property creation
      // Using the element id names properties
        Object.defineProperty(
          values,
          elem.id,
          {value: elem.value,
           writable: true,
           enumerable: true
          });
      });
      var notes = document.getElementById('notes').value;
      values.notes = notes;
      wheels.addSheet(values);
      display.showLengths();
      wheels.saveToLocalStorage();
      event.preventDefault();
    },
  newSheet: function() {
    // get hold of all the inputs and set their values to empty string
    // they may also be disabled so enable them
    // also disable other menu buttons except save
    var inputs = document.getElementsByTagName('input');
    Array.from(inputs).forEach(function (elem) {
      elem.value = "";
      elem.removeAttribute('disabled');
    });
    var notes = document.getElementById('notes');
    notes.value = '';
    notes.removeAttribute('disabled');
    var edit = document.getElementById('edit');
    var previous = document.getElementById('previous');
    var next = document.getElementById('next');
    edit.setAttribute('disabled', 'disabled');
    previous.setAttribute('disabled', 'disabled');
    next.setAttribute('disabled', 'disabled');
  }
};

var display = {
  showLengths: function() {
  // will display one set of lengths
  // 4 different lengths need to be calculated
  // calculateLength takes a wheelSet object with 6 properties
  // should have a crossNumber property
    var currentSheet = wheels.workSheet[0];
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
      centreToFlange: currentSheet.frontLeftCentreToFlange,
      effectiveRimDiameter: currentSheet.effectiveRimDiameterRear,
      spokeHoleDiameter: currentSheet.rearLeftHoleDiameter,
      flangeDiameter: currentSheet.rearLeftFlangeDiameter,
      numberOfSpokes: currentSheet.numberOfSpokesRear
    }
    var  wheelSpecs = [frontLeft, frontRight, rearLeft, rearRight];
    var spokeLengths = [];
    wheelSpecs.forEach(function(spec) {
      spokeLengths.push(wheels.calculateLength(spec));
    });
    // if it's only the front or the rear wheel, what then?
    // some of the wheelSpec objects may be null
    // then it's just a case of changing the boundaries of the for loop
    var spokeData = Array.from(document.getElementById('lengths').getElementsByTagName('td'));
    for (var i = 1; i < spokeData.length; i+=3) {
        spokeData[i].innerText = spokeLengths[i % 4];
        spokeData[i + 1].innerText = wheelSpecs[i % 4].numberOfSpokes / 2;
    }
  }
};
/*
TODO for pure js version
[done] create a calculate function
create a form validation function called when you save
[done] create an area to display results

Before developing the Spoke Length Calculator further
What I want is to create a digital version of my worksheet
- it should look similar (but not identical) to it
- it should allow entry of same data as worksheet
- it should allow you to 'turn' pages
- it should allow you to edit pages
- [done] it should allow you to save pages to storage
- it should allow searching of pages
- it should have some data for parts

// use placeholder text to save space
// use an object for priceList
// save function should save that worksheet and do a cost and spoke length calculation. Then add to local storage
[done] with all the extra data should wheelSet objects now be called workSheet?
// have a look at Bootstrap validations
// buttons should be disabled when they just repeat the current action such as saving the same data multiple times
// should worksheet objects have unique ids? For example when you edit or is array index enough?
// Fields should be disabled in browse mode but enabled in edit mode


- remove old hub fields and set up new 3 x 3 grid to accupt values
- refactor calculator to accept cross parameter
- display should fill 4 calculations
- should worksheet objects hold calculation data repeat each time?
- create a calculation for the costs
- create a jquery.ajax way to save and load data
*/
