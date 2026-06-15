import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Magic bytes signatures pour chaque format
const MAGIC_BYTES: Record<string, number[][]> = {
    "image/jpeg": [[0xFF, 0xD8, 0xFF]],
    "image/png": [[0x89, 0x50, 0x4E, 0x47]],
    "image/gif": [[0x47, 0x49, 0x46, 0x38]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
};

function checkMagicBytes(filePath: string, mimetype: string): boolean {
    const signatures = MAGIC_BYTES[mimetype];
    if (!signatures) return false;
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    return signatures.some((sig) =>
        sig.every((byte, i) => buffer[i] === byte)
    );
}

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueName + ext);
    },
});

const multerUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
            return cb(new Error("Type MIME non autorisé"));
        }
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return cb(new Error("Extension de fichier non autorisée"));
        }
        cb(null, true);
    },
});

// Middleware qui vérifie les magic bytes après l'upload
function validateUploadedFile(req: Request, res: Response, next: NextFunction) {
    if (!req.file) return next();
    if (!checkMagicBytes(req.file.path, req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Le contenu du fichier ne correspond pas à une image valide" });
    }
    next();
}

export const upload = {
    single: (fieldName: string) => [
        multerUpload.single(fieldName),
        validateUploadedFile,
    ],
};
