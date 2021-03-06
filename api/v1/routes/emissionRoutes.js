/* eslint-disable consistent-return */
/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
const emissionController = require('../controllers/emissionController');
const reverseLookupController = require('../controllers/reverseLookupController');

/**
 * @swagger
 * /emissions?electricity:
 *  post:
 *    tags:
 *    - "Emissions"
 *    security:
 *      - apiKeyAuth: []
 *    description: The emission route can be requested to find emission for any country for per kilowatt of electricity consumed. It can also deliver components of emission like generation and transmission & dissipation when queried with item names `generation` and `td` respectively.The data source for this is [here](https://www.google.co.in/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwihzNKT6MLUAhVLs48KHdzqCbMQFggsMAA&url=https%3A%2F%2Fecometrica.com%2Fassets%2FElectricity-specific-emission-factors-for-grid-electricity.pdf&usg=AFQjCNEJ8JPRvugX-uXAJwZEXi890P5XgA&sig2=9Q_msg2FZeRTGmzXduSXsg). The region that is unavailable results in returning the emission for the `Default` region which is calculated as a average of the whole data.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the item for which emission is to be found.
 *                type: string
 *                example: electricity
 *              region:
 *                required: true
 *                description: Region in which item exists
 *                type: string
 *                example: India
 *              quantity:
 *                required: true
 *                description: The number of units of the item for which emissions are to be calculated.
 *                type: number
 *                example: 1.564
 *              unit:
 *                required: false
 *                type: string
 *                description: The unit of the element for which emissions are to be calculated.
 *                example: kWh
 *              multiply:
 *                required: false
 *                type: number
 *                description: If emissions are to be found for multiple elements.
 *                example:
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */

/**
 * @swagger
 * /emissions?airplane:
 *  post:
 *    tags:
 *    - "Emissions"
 *    security:
 *      - apiKeyAuth: []
 *    description: Airplane fuel converts the distance flown by a particular air plane to corresponding CO2 emission.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the item for which emission is to be found.
 *                type: string
 *                example: airplane model A380
 *              region:
 *                required: true
 *                description: Region in which item exists
 *                type: string
 *                example: India
 *              quantity:
 *                required: true
 *                description: The number of units of the item for which emissions are to be calculated.
 *                type: number
 *                example: 125
 *              unit:
 *                required: false
 *                type: string
 *                description: The unit of the element for which emissions are to be calculated.
 *                example: nm
 *              multiply:
 *                required: false
 *                type: number
 *                description: If emissions are to be found for multiple elements.
 *                example:
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */

/**
 * @swagger
 * /emissions?vehicle:
 *  post:
 *    tags:
 *    - "Emissions"
 *    security:
 *      - apiKeyAuth: []
 *    description: Emission route can be requested with fuel quantity and type and unit , to return the GHG emission generated on the consumption of the same.The fuels that we currently support are listed [here](https://gitlab.com/aossie/CarbonFootprint/blob/master/Source/Core/core/resources/fuels.json).
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the item for which emission is to be found.
 *                type: string
 *                example: fuelPetrol
 *              region:
 *                required: true
 *                description: Region in which item exists
 *                type: string
 *                example: India
 *              quantity:
 *                required: true
 *                description: The number of units of the item for which emissions are to be calculated.
 *                type: number
 *                example: 2
 *              unit:
 *                required: false
 *                type: string
 *                description: The unit of the element for which emissions are to be calculated.
 *                example: L
 *              multiply:
 *                required: false
 *                type: number
 *                description: If emissions are to be found for multiple elements.
 *                example:
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */

/**
 * @swagger
 * /emissions?trains:
 *  post:
 *    tags:
 *    - "Emissions"
 *    security:
 *      - apiKeyAuth: []
 *    description: Emission route can provide you with the emission generated from a train journey, provided with the distance of the journey.Here the item is the the train type and multiply signifies the number of passengers.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the item for which emission is to be found.
 *                type: string
 *                example: railcars
 *              region:
 *                required: true
 *                description: Region in which item exists
 *                type: string
 *                example: Default
 *              quantity:
 *                required: true
 *                description: The number of units of the item for which emissions are to be calculated.
 *                type: number
 *                example: 1000
 *              unit:
 *                required: false
 *                type: string
 *                description: The unit of the element for which emissions are to be calculated.
 *                example: kg/km
 *              multiply:
 *                required: false
 *                type: number
 *                description: If emissions are to be found for multiple elements.
 *                example: 3
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */

/**
 * @swagger
 * /emissions?trees:
 *  post:
 *    tags:
 *    - "Emissions"
 *    security:
 *      - apiKeyAuth: []
 *    description: Emission route can be requested with tree name and the number of years to find out the CO2 absorption from it per year.The trees that we currently support are listed [here](https://gitlab.com/aossie/CarbonFootprint/blob/master/Source/Core/core/resources/trees.json).
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the item for which emission is to be found.
 *                type: string
 *                example: Cherry
 *              region:
 *                required: true
 *                description: Region in which item exists
 *                type: string
 *                example: Default
 *              quantity:
 *                required: true
 *                description: The number of units of the item for which emissions are to be calculated.
 *                type: number
 *                example: 1
 *              unit:
 *                required: false
 *                type: string
 *                description: The unit of the element for which emissions are to be calculated.
 *                example: year
 *              multiply:
 *                required: false
 *                type: number
 *                description: If emissions are to be found for multiple elements.
 *                example:
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */

/**
 * @swagger
 * /emissions?aplliances:
 *  post:
 *    tags:
 *    - "Emissions"
 *    security:
 *      - apiKeyAuth: []
 *    description: Emission route can be requested with a appliance name and the number of units and no of hours to find out the CO2 emission for the running time.The appliances that we currently support are listed [here](https://gitlab.com/aossie/CarbonFootprint-API/blob/master/raw_data/appliances.json).
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the item for which emission is to be found.
 *                type: string
 *                example: Air conditioner large
 *              region:
 *                required: true
 *                description: Region in which item exists
 *                type: string
 *                example: Africa
 *              quantity:
 *                required: true
 *                description: The number of units of the item for which emissions are to be calculated.
 *                type: number
 *                example: 1
 *              unit:
 *                required: false
 *                type: string
 *                description: The unit of the element for which emissions are to be calculated.
 *                example: kWh
 *              multiply:
 *                required: false
 *                type: number
 *                description: If emissions are to be found for multiple elements.
 *                example: 8
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */
router.route('/emissions').post(emissionController.emissions);
router.route('/comparer').post(reverseLookupController.comparer);

/**
 * @swagger
 * /flight:
 *  post:
 *    tags:
 *    - "Transport"
 *    security:
 *      - apiKeyAuth: []
 *    description: Find Emissions for a flight between two airports. Only [IATA Airport Codes](https://en.wikipedia.org/wiki/IATA_airport_code) are supported.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              origin:
 *                required: true
 *                description: Flight origin airport _IATA_ code.
 *                type: string
 *                example: DEL
 *              destination:
 *                required: true
 *                description: Flight destination airport _IATA_ code.
 *                type: string
 *                example: JFK
 *              type:
 *                required: false
 *                description: The fuel type used by the vehicle.
 *                type: string
 *                example: international
 *              model:
 *                required: false
 *                type: string
 *                description: Flight model (e.g A310). Default is `A380` for international flights and `A320` for domestic flights.
 *                example: A380
 *              passengers:
 *                required: false
 *                type: number
 *                description: Pass the number of passengers to get the emissions relative to per person on the flight.
 *                example: 840
 *    responses:
 *      200:
 *        description: Returns emission by the specified airplane model
 *      400:
 *        description: Error
 */
router.route('/flight').post(emissionController.flight);

/**
 * @swagger
 * /vehicle:
 *  post:
 *    tags:
 *    - "Transport"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find GHG emissions for a number of fuels.The distance is calculated using [Microsoft Distant Matrix API](https://docs.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-a-distance-matrix). The fuels that we currently support are listed [here](https://gitlab.com/aossie/CarbonFootprint/blob/master/Source/Core/core/resources/fuels.json).
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                required: true
 *                description: The fuel type used by the vehicle.
 *                type: string
 *                example: Petrol
 *              origin:
 *                required: true
 *                description: Origin of the journey.
 *                type: string
 *                example: Bhubaneswar
 *              destination:
 *                required: true
 *                description: Destination of the journey.
 *                type: string
 *                example: Cuttack
 *              mileage:
 *                required: true
 *                type: number
 *                description: The fuel efficiency of the vehicle i.e. distance traveled per unit of fuel. The default value is 20.
 *                example: 50
 *              mileage_unit:
 *                required: true
 *                type: string
 *                description: The unit of mileage. The default sets to be 'km/L'
 *                example: km/l
 *    responses:
 *      200:
 *        description: Returns emission by a vehicle for the distance between origin and destination
 *      400:
 *        description: Error
 */
router.route('/vehicle').post(emissionController.vehicle);

/**
 * @swagger
 * /trains:
 *  post:
 *    tags:
 *    - "Transport"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find GHG emissions for a number of train types for a certain route.The distance is calculated using [Microsoft Distant Matrix API](https://docs.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-a-distance-matrix). The trains that we currently support are listed [here](https://gitlab.com/aossie/CarbonFootprint-API/blob/master/raw_data/trains.json).
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                required: true
 *                description: The fuel type used by the vehicle.
 *                type: string
 *                example: railcars
 *              origin:
 *                required: true
 *                description: Origin of the journey.
 *                type: string
 *                example: Bhubaneswar
 *              destination:
 *                required: true
 *                description: Destination of the journey.
 *                type: string
 *                example: Delhi
 *              region:
 *                required: true
 *                type: number
 *                description: Origin of the journey. The default sets to 'Default'.
 *                example: India
 *              passengers:
 *                required: true
 *                type: string
 *                description: The number of passengers traveling in the journey.The default sets to 1.
 *                example: 10
 *    responses:
 *      200:
 *        description: Returns emission of a train for the distance between origin and destination
 *      400:
 *        description: Error
 */
// eslint-disable-next-line consistent-return
router.route('/trains').post(emissionController.trains);

/**
 * @swagger
 * /poultry:
 *  post:
 *    tags:
 *    - "Default"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find GHG emissions for different type of Poutry meat production. In this we consider the factors like Production emission, Water loss factor, Moisture loss factor, Post-farmgate emissions in different conditions according to region in which they are found. The different poultry type can be found [here](https://gitlab.com/aossie/CarbonFootprint-API/blob/master/raw_data/poultry.json).
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *                description: The type of the poultry meat(and egg). Type which are currently supported [are](https://gitlab.com/aossie/CarbonFootprint-API/blob/master/raw_data/poultry.json)
 *                required: true
 *                example: Broiler chicken
 *              region:
 *                description: Region in which the poultry meat(and egg) is produced. By default we use average of all regions.
 *                type: string
 *                example: British columbia
 *                required: false
 *              quantity:
 *                type: number
 *                description: The weight(number in case of egg) of poultry meat in production. By default we use 1 kg(1 quantity for egg)
 *                example: 3
 *                required: false
 *    responses:
 *      200:
 *        description: Returns electricity emissions
 *      400:
 *        description: Error
 */
// eslint-disable-next-line consistent-return
router.route('/poultry').post(emissionController.poultry);

/**
 * @swagger
 * /appliances:
 *  post:
 *    tags:
 *    - "Default"
 *    security:
 *      - apiKeyAuth: []
 *    description: The emission route can be requested to find emission for any country for per kilowatt of electricity consumed. It can also deliver components of emission like generation and transmission & dissipation when queried with item names `generation` and `td` respectively.The data source for this is [here](https://www.google.co.in/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwihzNKT6MLUAhVLs48KHdzqCbMQFggsMAA&url=https%3A%2F%2Fecometrica.com%2Fassets%2FElectricity-specific-emission-factors-for-grid-electricity.pdf&usg=AFQjCNEJ8JPRvugX-uXAJwZEXi890P5XgA&sig2=9Q_msg2FZeRTGmzXduSXsg). The region that is unavailable results in returning the emission for the `Default` region which is calculated as a average of the whole data.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              appliance:
 *                required: true
 *                description: The appliance name
 *                type: string
 *                example: Water heater
 *              region:
 *                required: true
 *                description: Region in which the appliance is used.
 *                type: string
 *                example: India
 *              type:
 *                type: string
 *                description: The type of the appliance. Its necessary if it exists.
 *                required: true
 *                example: instantaneous
 *              quantity:
 *                type: number
 *                description: The number of appliances being used.
 *                required: false
 *                example: 1
 *              running_time:
 *                type: number
 *                description: The number of hours the appliances are being used.
 *                required: false
 *                example: 3
 *    responses:
 *      200:
 *        description: Returns electricity emissions
 *      400:
 *        description: Error
 */
router.route('/appliances').post(emissionController.appliances);

/**
 * @swagger
 * /quantity:
 *  post:
 *    tags:
 *    - "Default"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route is can be used to retrieve the quantity of a certain element provided the CO2 emission for the specific item is already known. Refer to the [GHG Emission](https://docs.carbonhub.org/API-Reference/emissions.html) doc for more details on items available.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The item name
 *                type: string
 *                example: lamp
 *              region:
 *                required: true
 *                description: Region in which the item is used.
 *                type: string
 *                example: Ohio
 *              emission:
 *                type: number
 *                description: The quantity of emission recorded.
 *                required: true
 *                example: 91
 *    responses:
 *      200:
 *        description: Returns electricity emissions
 *      400:
 *        description: Error
 */
router.route('/quantity').post(emissionController.quantity);

/**
 * @swagger
 * /agriculture:
 *  post:
 *    tags:
 *    - "Global"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find global emissions for a number of agricultural processes for a certain country. The agricultural processes included are Enteric Fermentation, Manure Management, Rice Cultivation, Synthetic Fertilizers, Crop Residues etc.
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the agricultural process.
 *                type: string
 *                example: Synthetic Fertilizers
 *              region:
 *                required: true
 *                description: The country whose emissions are to be calculated.
 *                type: string
 *                example: India
 *    responses:
 *      200:
 *        description: Returns global emissions of agliculture for a region.
 *      400:
 *        description: Error
 */
router.route('/agriculture').post(emissionController.agriculture);

/**
 * @swagger
 * /food:
 *  post:
 *    tags:
 *    - "Global"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find global emissions for a number of food items for a certain country. The food items included are Cereals excluding rice Rice, paddy Meat, cattle Milk, whole fresh cow, Meat, goat Milk, whole fresh goat Meat, sheep Milk, whole fresh sheep
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The name of the food item.
 *                type: string
 *                example: rice, paddy
 *              region:
 *                required: true
 *                description: The country whose emissions are to be calculated.
 *                type: string
 *                example: India
 *    responses:
 *      200:
 *        description: Returns global emissions of food for a region.
 *      400:
 *        description: Error
 */
router.route('/food').post(emissionController.food);

/**
 * @swagger
 * /land:
 *  post:
 *    tags:
 *    - "Global"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find global emissions for different types of land for a certain country. The land types included are Forest land Cropland Grassland Burning Biomass
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              item:
 *                required: true
 *                description: The type of land.
 *                type: string
 *                example: Cropland
 *              region:
 *                required: true
 *                description: The country whose emissions are to be calculated.
 *                type: string
 *                example: India
 *    responses:
 *      200:
 *        description: Returns global emissions of land for particular use for a region.
 *      400:
 *        description: Error
 */
router.route('/land').post(emissionController.land);

/**
 * @swagger
 * /sector:
 *  post:
 *    tags:
 *    - "Global"
 *    security:
 *      - apiKeyAuth: []
 *    description: This route enables you to find global emissions for different types of sectors for a certain country. The sectors included are Energy, Industry and Waste
 *    produces:
 *      application/json
 *    consumes:
 *      application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sector:
 *                required: true
 *                description: The name of sector.
 *                type: string
 *                example: energy
 *              region:
 *                required: true
 *                description: The country whose emissions are to be calculated.
 *                type: string
 *                example: India
 *    responses:
 *      200:
 *        description: Returns global emissions of sector for a region.
 *      400:
 *        description: Error
 */
router.route('/sector').post(emissionController.sector);
module.exports = router;

// curl test- curl -H "Content-Type: application/json" -X POST -d '{"item":"electricity","region":"Africa","unit":"kWh","quantity":1}' http://localhost:3080/v1/emissions
// curl test- curl -H "Content-Type: application/json" -X POST -d '{"item":"airplane model A380","region":"Default","unit":"nm","quantity":125}' http://localhost:3080/v1/emissions
// curl test- curl -H "Content-Type: application/json" -X POST -d '{"type":"Petrol","distance":100,"unit":"km","mileage":50,"mileage_unit":"km/L"}' http://localhost:3080/v1/vehicle
// curl test- curl -H "Content-Type: application/json" -X POST -d '{"type":"international","model":"A380","origin":"DEL","destination":"IXG"}' http://localhost:3080/v1/flight
