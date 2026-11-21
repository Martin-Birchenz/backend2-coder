import { generateToken } from "../utils/jwt.utils.js";
import { UserDTO } from "../dto/user.dto.js";
import { envConfig } from "../config/env.config.js";

class SessionController {
  register(req, res) {
    return res.status(201).json({
      status: "success",
      payload: new UserDTO(req.user),
    });
  }

  login(req, res) {
    const token = generateToken(req.user);

    res.cookie("jwtCookie", token, {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      payload: new UserDTO(req.user),
    });
  }

  current(req, res) {
    return res.status(200).json({
      status: "success",
      payload: new UserDTO(req.user),
    });
  }

  logout(req, res) {
    res.clearCookie("jwtCookie");
    return res.status(200).json({
      status: "success",
      message: "Sesión cerrada correctamente",
    });
  }
}

export default new SessionController();
