"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_convert_1 = __importDefault(require("image-convert"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const path_2 = require("path");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = (0, path_2.dirname)(__filename);
function convertImage(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            image_convert_1.default.fromURL(options, (err, buffer, file) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        buffer,
                        file: {
                            size: file.size,
                            format: file.format
                        }
                    });
                }
            });
        });
    });
}
const options = {
    url: "https://cdn.weread.qq.com/weread/cover/37/YueWen_924389/t6_YueWen_924389.jpg",
    quality: 90,
    output_format: "jpg",
    size: 1080
};
convertImage(options)
    .then((result) => __awaiter(void 0, void 0, void 0, function* () {
    const outputDir = path_1.default.join(__dirname, 'output');
    try {
        yield promises_1.default.mkdir(outputDir, { recursive: true });
    }
    catch (err) {
        if (err instanceof Error && 'code' in err && err.code !== 'EEXIST') {
            throw err;
        }
    }
    const outputPath = path_1.default.join(outputDir, `converted.${options.output_format}`);
    yield promises_1.default.writeFile(outputPath, result.buffer);
    console.log(`File saved to: ${outputPath}`);
}))
    .catch(console.error);
//# sourceMappingURL=index.js.map