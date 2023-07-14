import Cars from "../models/carsModel.js";
import Dealership from "../models/dealershipModel.js";
import SoldVehicles from "../models/soldVehiclesModel.js";

//Protected by Dealer
export const createVehicle = async (req, res, next) => {
  try {
    const { dealershipId, type, name, model, car_info } = req.body;

    // Check if the dealership exists
    const dealership = await Dealership.findById(dealershipId);
    if (!dealership) {
      return res.status(404).json({
        success: false,
        message: "Dealership not found",
      });
    }

    // Create the car and add its ID to the dealership's cars array
    const car = await Cars.createCar({
      type,
      name,
      model,
      car_info,
      dealership_id: dealershipId,
      created_at: new Date(),
    });
    dealership.cars.push(car._id);
    await Dealership.save(dealership);

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCars = async (req, res, next) => {
  try {
    const cars = await Cars.findAll();
    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    next(error);
  }
};

// Not protected
export const getAllDealershipCarsByDealershipId = async (req, res, next) => {
  try {
    const { dealershipId } = req.params;
    const cars = await Cars.findByDealershipId(dealershipId);

    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const car = await Cars.findById(carId);
    if (!car) {
      return next(new ErrorHandler("Car not found", 404));
      // return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(200).json({ success: true, car });
  } catch (error) {
    next(error);
  }
};
// protected by dealer not necessary
export const getSoldCarsByDealership = async (req, res, next) => {
  try {
    const { dealershipId } = req.params;

    // Get the cars sold by the dealership
    const soldCars = await SoldVehicles.getSoldCarsByDealership(dealershipId);

    // Retrieve the car details for the sold cars
    const cars = [];
    for (const soldCar of soldCars) {
      const car = await Cars.getCarById(soldCar.car_id);
      if (car) {
        cars.push(car);
      }
    }

    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    next(error);
  }
};