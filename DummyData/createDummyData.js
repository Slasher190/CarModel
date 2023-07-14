import { faker } from "@faker-js/faker";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Dealership from "../models/dealershipModel.js";
import Deal from "../models/dealModel.js";
import Cars from "../models/carsModel.js";
import SoldVehicles from "../models/soldVehiclesModel.js";

const createDummyData = async (req, res, next) => {
  // Create dummy data for admin, user, dealership, deal, cars, sold_vehicles collections
  try {
    await Admin.createAdmin({ admin_id: "admin1", password: "admin123" });

    // Create multiple users
    for (let i = 1; i <= 10; i++) {
      const user = {
        user_email: `user${i}@example.com`,
        user_id: `user${i}`,
        password: `user${i}123`,
        user_location: faker.location.city(),
      };
      await User.createUser(user);
    }

    // Create multiple dealerships
    for (let i = 1; i <= 5; i++) {
      const dealership = {
        dealership_email: `dealership${i}@example.com`,
        dealership_id: `dealership${i}`,
        password: `dealership${i}123`,
        dealership_location: faker.location.city(),
        dealership_name: faker.person.firstName(),
      };
      await Dealership.createDealership(dealership);
    }

    // Create other dummy data
    await Deal.createDeal({ deal_id: "deal1", car_id: "car1" });
    await Cars.createCar({
      car_id: "car1",
      type: "sedan",
      name: "Car 1",
      model: "2022",
      car_info: {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        color: faker.vehicle.color(),
      }
    });


    await SoldVehicles.createSoldVehicle({
      vehicle_id: "vehicle1",
      car_id: "car1",
      vehicle_info: {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        color: faker.vehicle.color(),
      },
    });

    // Generate and insert more dummy data if needed
    for (let i = 0; i < 100; i++) {
      const car = {
        car_id: `car${i + 2}`,
        type: faker.vehicle.type(),
        name: faker.vehicle.model(),
        model: "2022",
        car_info: {
          make: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          color: faker.vehicle.color(),
        }
      };
      await Cars.createCar(car);

      const vehicle = { vehicle_id: `vehicle${i + 2}`, car_id: car.car_id };
      await SoldVehicles.createSoldVehicle(vehicle);

      const deal = { deal_id: `deal${i + 2}`, car_id: car.car_id };
      await Deal.createDeal(deal);
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export default createDummyData;
