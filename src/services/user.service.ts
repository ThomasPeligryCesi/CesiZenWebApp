import prisma from "../config/prisma";

export async function getAllUsers() {
    return prisma.user.findMany({
        select: { id: true, email: true, role: true, state: true }
    });
}

export async function updateUserRole(id: string, role: string) {
    return prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, email: true, role: true, state: true }
    });
}

export async function updateUserState(id: string, state: number) {
    return prisma.user.update({
        where: { id },
        data: { state },
        select: { id: true, email: true, role: true, state: true }
    });
}
