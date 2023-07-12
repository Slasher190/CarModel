import Admin from "./adminModel.js";
import User from "./userModel.js";
import Dealership from "./dealershipModel.js";
import Deal from "./dealModel.js";
import Cars from "./carsModel.js";
import SoldVehicles from "./soldVehiclesModel.js";

const Models = async () => {
  await Admin.createAdminCollection();
  // console.log("Admin Collection created ");
  await User.createUserCollection();
  // console.log("User collection created");
  await Dealership.createDealershipCollection();
  // console.log("Dealership collection created");
  await Deal.createDealCollection();
  // console.log("Deal collection created ");
  await Cars.createCarsCollection();
  // console.log("Cars Collection Created");
  await SoldVehicles.createSoldVehiclesCollection();
  // console.log("Sold Vehicles collection created ");
};

export default Models;
