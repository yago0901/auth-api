import "dotenv/config";
import { TokenService } from "../services/token.service.js";

const tokenService = new TokenService();

const refreshToken = tokenService.generateRefreshToken();

console.log("Refresh Token:");
console.log(refreshToken);

console.log("");

console.log("Hash:");
console.log(tokenService.hashRefreshToken(refreshToken));