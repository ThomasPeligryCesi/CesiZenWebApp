import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto, { hash } from "crypto";
import prisma from "../config/prisma";
import { sendPasswordResetEmail } from "./email.service";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "5m";
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "60d";

function generateAccessToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

function getRefreshExpiresAt(): Date {
  const match = REFRESH_EXPIRES_IN.match(/^(\d+)([dhms])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const value = parseInt(match[1]);
  const unit = match[2];
  const ms = { d: 86400000, h: 3600000, m: 60000, s: 1000 }[unit] || 86400000;
  return new Date(Date.now() + value * ms);
}

async function generateRefreshToken(userId: string) {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = getRefreshExpiresAt();
  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
  return token;
}

export async function register(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("coucou");
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "user",
      state: 1,
    },
  });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = await generateRefreshToken(user.id);

  return { accessToken, refreshToken, role: user.role };
}

export async function login(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser || existingUser.state !== 1) {
    throw new Error("Identifiants inconnus");
  }
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (passwordMatch) {
    const accessToken = generateAccessToken(existingUser.id, existingUser.role);
    const refreshToken = await generateRefreshToken(existingUser.id);
    return { accessToken, refreshToken, role: existingUser.role };
  }
  throw new Error("Identifiants inconnus");
}

// Fonction pour rafraîchir les tokens (refresh token reste en base, access token est régénéré toutes les 5 min)
export async function refresh(token: string) {
  const stored = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    throw new Error("Refresh token invalide ou expiré");
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const accessToken = generateAccessToken(stored.user.id, stored.user.role);
  const refreshToken = await generateRefreshToken(stored.user.id);

  return { accessToken, refreshToken };
}

export async function logout(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }
  await prisma.resetToken.deleteMany({ where: { userId: user.id } });
    
  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  await prisma.resetToken.create({
    data: { token: hashedToken, userId: user.id, expiresAt },
  });

  await sendPasswordResetEmail(email, rawToken);  
}

export async function resetPassword(rawToken: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const storedToken = await prisma.resetToken.findUnique({
        where: { token: hashedToken },
        include: { user: true },
    });
    const user = storedToken?.user;

    if (!storedToken || !user || storedToken.expiresAt < new Date() || storedToken.used || user.state !== 1) {
        if (storedToken) {
                await prisma.resetToken.update({
        where: { id: storedToken.id },
        data: { used: true },
    });
        }
        throw new Error("Token de réinitialisation invalide ou expiré");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({ where: { id: storedToken.userId }, data: { password: hashedPassword } }),
      prisma.resetToken.update({ where: { id: storedToken.id }, data: { used: true } }),
      prisma.refreshToken.deleteMany({ where: { userId: storedToken.userId } }),
    ]);
  }