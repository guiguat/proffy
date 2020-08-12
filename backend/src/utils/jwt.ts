import jwt from "jsonwebtoken";
export function genToken(id: string) {
  return jwt.sign({ id }, "secret", {
    expiresIn: 86400,
  });
}
