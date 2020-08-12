import jwt from "jsonwebtoken";
export function genToken(id: string) {
  return jwt.sign({ id }, String(process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: 86400,
  });
}
