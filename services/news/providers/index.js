const toiApiProvider = require("./toiApiProvider");
const bbcProvider = require("./bbcProvider");
const hinduProvider = require("./hinduProvider");
const indianExpressProvider = require("./indianExpressProvider");
const hindustanTimesProvider = require("./hindustanTimesProvider");
const guardianProvider = require("./guardianProvider");
const spaceProvider = require("./spaceProvider");
const physOrgProvider = require("./physOrgProvider");
const scienceDailyProvider = require("./scienceDailyProvider");
const dwProvider = require("./dwProvider");
 const techcrunchProvider = require("./techcrunchProvider");
   const aljazeeraProvider = require("./aljazeeraProvider");
const cnbcProvider = require("./cnbcProvider");

const natureProvider = require("./natureProvider");
const etProvider = require("./etProvider");

const news18Provider = require("./news18Provider");

const historyProvider = require("./historyProvider");

const globalentertainmentProvider = require("./globalentertainmentProvider");

const travelProvider = require("./travelProvider");





  

const providers = [
  toiApiProvider,
  bbcProvider,
  hinduProvider,
  indianExpressProvider,
  hindustanTimesProvider,
  guardianProvider,
  spaceProvider,
  physOrgProvider,
  scienceDailyProvider,
 
  dwProvider,
  techcrunchProvider,
  aljazeeraProvider,
  cnbcProvider,
  natureProvider,
  etProvider,
  news18Provider,
  historyProvider,
  globalentertainmentProvider,
  travelProvider,
 
];

// Temporary for testing
//module.exports = [shortsProvider];

// Normal
module.exports = providers;