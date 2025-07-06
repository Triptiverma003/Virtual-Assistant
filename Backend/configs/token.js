import jwt from "jsonwebtoken";

const genToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

export default genToken;
