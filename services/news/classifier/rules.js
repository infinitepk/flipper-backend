module.exports = {


     weather: {
        threshold: 5,
        keywords: {
            rain: 5,
            rainfall: 5,
            monsoon: 4,
            cyclone: 5,
            storm: 4,
            thunderstorm: 5,
            flood: 5,
            drought: 5,
            heatwave: 5,
            snowfall: 5,
            snow: 4,
            temperature: 3,
            humidity: 2,
            imd: 5,
            forecast: 5,
            weather: 3,
            climate: 2,
        },
    },


    space: {
        threshold: 5,

        keywords: {
            isro: 2,
            nasa: 2,
            spacex: 4,
            rocket: 5,
            satellite: 4,
            launch: 4,
            astronaut: 4,
            moon: 4,
            mars: 4,
            orbit: 4,
            spacecraft: 4,
            gslv: 5,
            pslv: 5,
            chandrayaan: 5,
            "aditya-l1": 5,
        },
    },

    nature: {
        threshold: 5,

        keywords: {
            tiger: 4,
            lion: 4,
            elephant: 4,
            forest: 3,
            wildlife: 4,
            environment: 2,
            climate: 2,
            rainforest: 4,
            "national park": 5,
            biodiversity: 3,
            conservation: 3,
            habitat: 4,
        },
    },

    history: {
        threshold: 5,

        keywords: {
    // Generic history
    ancient: 4,
    archaeology: 5,
    archaeological: 5,
    excavation: 4,
    dynasty: 4,
    empire: 4,
    historic: 3,
    heritage: 4,
    monument: 3,
    unesco: 5,

    // Indian archaeology & heritage
    asi: 5,
    "archaeological survey of india": 6,
    inscription: 4,
    artifact: 4,
    artefact: 4,
    relic: 4,
    "excavation site": 5,
    "heritage site": 5,

    // Ancient Indian civilizations
    harappa: 6,
    harappan: 6,
    mohenjo: 6,
    "indus valley": 6,
    civilization: 4,

     hampi: 5,
nalanda: 5,
sanchi: 5,
ajanta: 5,
ellora: 5,
konark: 5,
mahabalipuram: 5,
dholavira: 6,
lothal: 6,
rakhigarhi: 6,

    // Indian dynasties
    maurya: 4,
    mauryan: 5,
    gupta: 4,
    chola: 5,
    pandya: 5,
    pallava: 5,
    satavahana: 5,
    vijayanagara: 5,
    mughal: 4,
    maratha: 4,
    cholas: 5,

    // Indian heritage
    stupa: 4,
    vihara: 4,
    temple: 3,
    fort: 3,
    palace: 3,
    mosque: 3,
    monastery: 4,

    // Culture & history
    manuscript: 4,
    epigraphy: 5,
    coin: 3,
    sculpture: 3,
    excavation: 4,
}
    },

    travel: {
        threshold: 5,

        keywords: {
            tourism: 4,
            tourist: 3,
            travel: 3,
            destination: 3,
            airport: 4,
            airline: 4,
            flight: 4,
            hotel: 3,
            visa: 5,
            holiday: 3,
        },
    },
};