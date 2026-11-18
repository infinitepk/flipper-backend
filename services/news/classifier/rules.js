module.exports = {
  weather: {
    threshold: 6,
    exclude: ["heat check", "stormed the stage", "political storm", "brainstorm"],
    keywords: {
      // Definitive meteorological events (Instant triggers)
      cyclone: 6, thunderstorm: 6, heatwave: 6, "heat wave": 6,
      landslide: 6, avalanche: 6, blizzard: 6, tornado: 6,
      "cloud burst": 6, cloudburst: 6, "air quality index": 6, aqi: 5,
      "red alert": 6, "orange alert": 5, "yellow alert": 4,

      // Meteorological terminology
      meteorology: 5, meteorological: 5, imd: 5, "weather forecast": 5,
      rainfall: 4, precipitation: 5, monsoon: 4, depression: 3,
      "low pressure area": 5, snowfall: 5, drought: 5, flood: 4, floods: 4,

      // Weak / Contextual indicators
      rain: 2, storm: 2, temperature: 2, humidity: 2, forecast: 2,
      climate: 2, celsius: 2, fahrenheit: 2, foggy: 2, hail: 3
    }
  },

  space: {
    threshold: 6,
    exclude: ["office space", "storage space", "parking space", "personal space", "breathing space"],
    keywords: {
      // Direct space missions & craft
      isro: 6, nasa: 6, spacex: 6, esa: 6, jaxa: 6, "blue origin": 6,
      chandrayaan: 6, "aditya-l1": 6, gaganyaan: 6, artemis: 6,
      spacecraft: 6, "space station": 6, "international space station": 6, iss: 5,
      "james webb": 6, hubble: 5, "space telescope": 6,
      "lunar lander": 6, "mars rover": 6, gslv: 6, pslv: 6, sslv: 6, starship: 5,

      // Astronomical / Astrophysics
      exoplanet: 6, supernova: 6, "black hole": 6, "neutron star": 6,
      asteroid: 5, meteor: 4, meteorite: 5, comet: 5, cosmos: 4,
      interstellar: 5, astrophysics: 5, "celestial body": 5,

      // Contextual indicators
      astronaut: 4, cosmonaut: 4, orbit: 3, "orbital launch": 6,
      "satellite launch": 6, satellite: 3, rocket: 3, eclipse: 3,
      mars: 2, moon: 1, planet: 2
    }
  },

  nature: {
    threshold: 6,
    exclude: ["concrete jungle", "lionhearted", "tiger economy"],
    keywords: {
      // Protected habitats & ecology
      "national park": 6, "wildlife sanctuary": 6, "tiger reserve": 6,
      "biosphere reserve": 6, biodiversity: 5, "ecological hotspot": 6,
      endangered: 4, "critically endangered": 6, deforestation: 5,
      afforestation: 5, poaching: 6, poachers: 6, wetlands: 5,

      // Ecological sciences
      ecosystem: 4, conservationist: 5, habitat: 4, flora: 4, fauna: 4,
      botanical: 4, zoological: 4, species: 3, wildlife: 4,

      // Fauna anchors
      tiger: 3, leopard: 3, cheetah: 3, elephant: 3, rhinoceros: 4,
      snowleopard: 5, "great indian bustard": 6, reptile: 3, amphibian: 4,

      // Contextual indicators
      forest: 2, jungle: 2, rainforest: 4, climate: 1, environment: 2
    }
  },

  history: {
    threshold: 6,
    // Eliminates sports & celebrity overlap
    exclude: ["hardik pandya", "krunal pandya", "parthiv patel", "box office history", "history made"],
    keywords: {
      // Academic disciplines & verification
      archaeology: 6, archaeological: 6, excavation: 6, epigraphy: 6,
      numismatics: 6, "archaeological survey of india": 6, asi: 4,
      unesco: 4, "world heritage site": 6, antiquity: 5, prehistoric: 5,
      paleolithic: 6, neolithic: 6, megalithic: 6,

      // Relics & physical remains
      artifact: 5, artefact: 5, relic: 5, manuscript: 5, inscription: 5,
      fossil: 4, ruins: 4, "excavation site": 6, "rock-cut": 5, edict: 5,

      // Multi-word dynasties & civilizations (Guaranteed history)
      "indus valley": 6, "harappan civilization": 6, "gupta dynasty": 6,
      "gupta empire": 6, "mauryan empire": 6, "pandya dynasty": 6,
      "chola dynasty": 6, "chola empire": 6, "pallava dynasty": 6,
      "vijayanagara empire": 6, "mughal empire": 6, "maratha empire": 6,
      "satavahana dynasty": 6, "kakatiya dynasty": 6, "chalukya dynasty": 6,

      // Key archaeological sites
      harappa: 6, mohenjo: 6, "mohenjo-daro": 6, dholavira: 6, lothal: 6,
      rakhigarhi: 6, hampi: 5, nalanda: 5, mahabalipuram: 5,

      // Surnames / Dynasty words downgraded (Prevents false positives on modern names)
      gupta: 2, pandya: 2, maurya: 2, chola: 3, cholas: 3,
      mughal: 3, maratha: 2, vijayanagara: 3, pallava: 3, satavahana: 3,

      // Architectural & Contextual
      stupa: 4, vihara: 4, dynasty: 4, empire: 3, ancient: 3,
      monument: 2, temple: 1, fort: 1, palace: 1
    }
  },

  travel: {
    threshold: 6,
    exclude: ["travelled back in time", "space travel", "travelling violation"],
    keywords: {
      // Tourism & Hospitality
      tourism: 5, tourist: 4, itinerary: 6, backpacker: 5, staycation: 5,
      "hill station": 5, resort: 4, hospitality: 4, homestay: 4,
      "sightseeing tour": 6, sightseeing: 5, "heritage walk": 5,

      // Visas & Borders
      "tourist visa": 6, "visa on arrival": 6, "visa-free": 6,
      passport: 3, immigration: 3, customs: 2,

      // Aviation & Rail Transit
      boarding: 3, aviation: 4, airline: 4, airlines: 4, airport: 3,
      flight: 3, flights: 3, "vande bharat": 4, "sleeper coach": 4,
      layover: 5, terminal: 2, baggage: 3, luggage: 3,

      // Contextual indicators
      vacation: 4, holiday: 3, destination: 3, hotel: 2, travel: 2, trip: 2
    }
  },

  crime: {
    threshold: 6,
    // Exclude film shoots, sports shooting, mock drills
    exclude: ["movie shooting", "film shooting", "photo shoot", "shooting range", "target shooting"],
    keywords: {
      // Investigatory & Law enforcement bodies
      "first information report": 6, fir: 5, "cbi probe": 6, "ed raids": 6,
      "nia raid": 6, "chargesheet filed": 6, chargesheet: 5,
      "anti-corruption bureau": 6, interpol: 6, "forensic team": 5,

      // Violent crime
      homicide: 6, murder: 5, murdered: 5, kidnapping: 6, abducted: 6,
      dacoity: 6, extortion: 6, "opened fire": 6, lynching: 6,
      "sexual assault": 6, rape: 6, stabbing: 5, stabbed: 5, shootout: 5,
      assassination: 6, manslaughter: 6,

      // Financial & organized crime
      "money laundering": 6, embezzlement: 6, contraband: 5, narcotics: 5,
      "drug cartel": 6, cybercrime: 6, "cyber crime": 6, phishing: 5,
      human: 1, "human trafficking": 6, smuggling: 5, extortionist: 6,

      // Legal outcomes
      "life imprisonment": 6, "death penalty": 6, "police remand": 6,
      "judicial custody": 6, convicted: 5, sentenced: 5, undertrial: 5,
      bail: 3, arrest: 4, arrested: 4, detained: 3, suspect: 3, accused: 3
    }
  }
};