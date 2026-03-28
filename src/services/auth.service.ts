import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export async function register(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "user",
      state: 1,
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return token;
}

export async function login(email: string, password: string) {

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (!existingUser || existingUser.state !== 1) {
        throw new Error("Identifiants inconnus");
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if(passwordMatch){
        const token = jwt.sign(
            { userId: existingUser.id, role: existingUser.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );
        return token;
    }
        throw new Error("Identifiants inconnus");
}
