"use strict";
/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Juno Core: API functions
 *
 * Here you will find the core functions of Juno.
 *
 * @license      {@link https://github.com/digitsensitive/juno-console/blob/master/license.txt|MIT License}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const key_enum_1 = require("../enums/key.enum");
class API {
    constructor(cr, inputs) {
        this.cr = cr;
        this.inputs = inputs;
        this.spritesheets = [];
        this.passedTicks = 0;
    }
    /********************************************************************
     * Init color palette with chain hex color string
     * Total 16 colors: 6 * 16 = 96 (string length)
     * Examples:
     * Juno:
     * 1a1c2c572956b14156ee7b58ffd079a0f07238b86e276e7b29366f405bd04fa4f786ecf8f4f4f493b6c1557185324056
     * TIC-80 (DB16):
     * 140C1C44243430346D4E4A4F854C30346524D04648757161597DCED27D2C8595A16DAA2CD2AA996DC2CADAD45EDEEED6
     * COMMODORE VIC-20 PALETTE
     * 000000ffffffa8734ae9b287772d26b6686285d4dcc5ffffa85fb4e99df5559e4a92df8742348b7e70cabdcc71ffffb0
     * STILL LIFE PALETTE
     * 3f28117a2222d13b27e07f8a5d853a68c127b3e868122615513155286fb89b8bffa8e4d4cc8218c7b581000000ffffff
     * JAPANESE MACHINE PALETTE
     * 00000019102846af45a1d685453e787664fe8331299ec2e8dc534be18d79d6b97be9d8a1216c4bd365c8afaab9f5f4eb
     * CGARNE PALETTE
     * 0000005e606e2234d10c7e455c2e78b5b5b5FFFFFFffd93f7be2f98a36224c81fb44aacceb8a60aa5c3d6cd947e23d69
     * PSYGNOSIA PALETTE
     * 0000001b1e29362747443f4152524c64647c73615077785b9ea4a7cbe8f7e08b79a2324e003308084a3c546a00516cbf
     * COLOR GRAPHICS ADAPTER PALETTE
     * 000000555555AAAAAAFFFFFF0000AA5555FF00AA0055FF5500AAAA55FFFFAA0000FF5555AA00AAFF55FFAA5500FFFF55
     * EROGE COPPER PALETTE
     * 0d080d4f2b24825b31c59154f0bd77fbdf9bfff9e4bebbb27bb24e74adbb4180a032535f2a23497d3840c16c5be89973
     * EASTER ISLAND PALETTE
     * f6f6bfe6d1d1868691794765f5e17aedc38dcc8d86ca657e39d4b98dbcd28184ab6860869dc0857ea788567864051625
     * PICO-8 PALETTE
     * 0000001D2B537E255383769CAB5236008751FF004D5F574FFF77A8FFA300C2C3C700E436FFCCAA29ADFFFFEC27FFF1E8
     * GRAYSCALE
     * 000000111111222222333333444444555555666666777777888888999999aaaaaabbbbbbccccccddddddeeeeeeffffff
     *
     * @param palette [index of the color in the palette]
     ********************************************************************/
    ipal(palette) {
        this.palette = [];
        let fromPositionInString = 0;
        while (fromPositionInString < 96) {
            this.palette.push("#" + palette.substr(fromPositionInString, 6));
            fromPositionInString += 6;
        }
    }
    /********************************************************************
     * Clear the screen with a specified color.
     * @param color [index of the color in the palette]
     /********************************************************************/
    cls(c) {
        const context = this.cr.renderer;
        if (c === undefined) {
            // clear screen
            context.clearRect(0, 0, this.cr.canvas.width, this.cr.canvas.height);
        }
        else {
            // evaluate runtime errors
            this.colorRangeError(c);
            // draw the selected color on screen
            context.fillStyle = this.palette[c];
            context.fillRect(0, 0, this.cr.canvas.width, this.cr.canvas.height);
        }
        // update ticks
        this.passedTicks += 1;
    }
    /********************************************************************
     * Draw one pixel at a specific 2D location (x and y).
     * @param x0    [x coordinate of the pixel]
     * @param y0    [y coordinate of the pixel]
     * @param color [index of the color in the palette]
     ********************************************************************/
    pix(x0, y0, c) {
        // evaluate runtime errors
        this.colorRangeError(c);
        this.cr.renderer.fillStyle = this.palette[c];
        this.cr.renderer.fillRect(x0 * this.cr.options.scaleFactor, y0 * this.cr.options.scaleFactor, this.cr.options.scaleFactor, this.cr.options.scaleFactor);
    }
    /********************************************************************
     * Create a circle outline with the Bresenham's circle algorithm.
     * @param  x        [x coordinate of the center of the circle]
     * @param  y        [y coordinate of the center of the circle]
     * @param  r        [radius of the circle]
     * @param  c        [index of the color in the palette]
     ********************************************************************/
    circb(x0, y0, r, c) {
        // evaluate runtime errors
        this.colorRangeError(c);
        let x = 0;
        let y = r;
        let p = 3 - 2 * r;
        this.circbPixGroup(x0, y0, x, y, c);
        while (x < y) {
            x++;
            if (p < 0) {
                p = p + 4 * x + 6;
            }
            else {
                y--;
                p = p + 4 * (x - y) + 10;
            }
            this.circbPixGroup(x0, y0, x, y, c);
        }
    }
    /********************************************************************
     * [pixel description]
     * @param xc [description]
     * @param yc [description]
     * @param x  [description]
     * @param y  [description]
     * @param c  [description]
     ********************************************************************/
    circbPixGroup(x0, y0, x, y, c) {
        this.pix(x0 + x, y0 + y, c);
        this.pix(x0 + x, y0 - y, c);
        this.pix(x0 - x, y0 + y, c);
        this.pix(x0 - x, y0 - y, c);
        this.pix(x0 + y, y0 + x, c);
        this.pix(x0 + y, y0 - x, c);
        this.pix(x0 - y, y0 + x, c);
        this.pix(x0 - y, y0 - x, c);
    }
    /********************************************************************
     * Filled Circle (100%)
     * Create a filled circle with the Bresenham's circle algorithm.
     * @param x0 [x coordinate of the center of the circle]
     * @param y0 [y coordinate of the center of the circle]
     * @param r  [radius of the circle]
     * @param c  [index of the color in the palette]
     ********************************************************************/
    circ(x0, y0, r, c) {
        // evaluate runtime errors
        this.colorRangeError(c);
        // draw filled circle
        let x = 0;
        let y = r;
        let p = 3 - 2 * r;
        this.circPixGroup(x0, y0, x, y, c);
        while (x < y) {
            x++;
            if (p < 0) {
                p = p + 4 * x + 6;
            }
            else {
                y--;
                p = p + 4 * (x - y) + 10;
            }
            this.circPixGroup(x0, y0, x, y, c);
        }
    }
    /********************************************************************
     * Group of pixel lines (100%)
     * Draws a group of lines, used for drawing a filled circle.
     * @param x0 [first x coordinate]
     * @param y0 [first y coordinate]
     * @param x  [second x coordinate]
     * @param y  [second y coordinate]
     * @param c  [index of the color in the palette]
     ********************************************************************/
    circPixGroup(x0, y0, x, y, c) {
        this.line(x0 + x, y0 + y, x0 - x, y0 + y, c);
        this.line(x0 + x, y0 - y, x0 - x, y0 - y, c);
        this.line(x0 + y, y0 + x, x0 - y, y0 + x, c);
        this.line(x0 + y, y0 - x, x0 - y, y0 - x, c);
    }
    /********************************************************************
     * Create a line with the Bresenham's line algorithm.
     * @param x0 [the starting x position]
     * @param y0 [the starting y position]
     * @param x1 [the ending x position]
     * @param y1 [the ending y position]
     * @param c  [index of the color in the palette]
     ********************************************************************/
    line(x0, y0, x1, y1, c) {
        // evaluate runtime errors
        this.colorRangeError(c);
        x0 = Math.ceil(x0);
        y0 = Math.ceil(y0);
        x1 = Math.ceil(x1);
        y1 = Math.ceil(y1);
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        for (let x = 0; x <= dx; x++) {
            for (let y = 0; y <= dy; y++) {
                this.pix(x0, y0, c);
                if (x0 == x1 && y0 == y1) {
                    break;
                }
                let e2 = 2 * err;
                if (e2 >= -dy) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y0 += sy;
                }
            }
        }
    }
    /********************************************************************
     * Draw a filled rectangle.
     * @param x0    [the x position of the rectangle]
     * @param y0    [the y position of the rectangle]
     * @param w     [the width of the rectangle]
     * @param h     [the height of the rectangle]
     * @param c [index of the color in the palette]
     ********************************************************************/
    rect(x0, y0, w, h, c) {
        // evaluate runtime errors
        if (w <= 0) {
            throw new RangeError("The width of a rectangle must be > 0. ");
        }
        else if (h <= 0) {
            throw new RangeError("The height of a rectangle must be > 0. ");
        }
        this.colorRangeError(c);
        this.cr.renderer.fillStyle = this.palette[c];
        this.cr.renderer.fillRect(x0 * this.cr.options.scaleFactor, y0 * this.cr.options.scaleFactor, w * this.cr.options.scaleFactor, h * this.cr.options.scaleFactor);
    }
    /********************************************************************
     * Draw a rectangle outline.
     * @param x0    [the x position of the rectangle]
     * @param y0    [the y position of the rectangle]
     * @param w     [the width of the rectangle]
     * @param h     [the height of the rectangle]
     * @param c     [index of the color in the palette]
     ********************************************************************/
    rectb(x0, y0, w, h, c) {
        // evaluate runtime errors
        if (w <= 0) {
            throw new RangeError("The width of a rectangle must be > 0. ");
        }
        else if (h <= 0) {
            throw new RangeError("The height of a rectangle must be > 0. ");
        }
        this.colorRangeError(c);
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
                    this.pix(x0 + x, y0 + y, c);
                }
            }
        }
    }
    /********************************************************************
     * Print text.
     * @param s  [string to print]
     * @param x  [x position of the text]
     * @param y  [y position of the text]
     * @param c  [index of the color in the palette]
     * @param sc [scale factor of the text]
     ********************************************************************/
    print(s, x0, y0, c, a, sc) {
        // evaluate runtime errors
        if (sc !== undefined && sc < 1) {
            throw new RangeError("The font size cannot be smaller than 1. ");
        }
        else if (s.length === 0) {
            throw new RangeError("The font length must be longer than 0. ");
        }
        this.colorRangeError(c);
        let size = sc * 3 * this.cr.options.scaleFactor || 3 * this.cr.options.scaleFactor;
        this.cr.renderer.font = size + "px Juno";
        this.cr.renderer.fillStyle =
            this.palette[c] + this.calculateAlphaHexCode(a || 1);
        this.cr.renderer.fillText(s, x0 * this.cr.options.scaleFactor, y0 * this.cr.options.scaleFactor + size);
    }
    /********************************************************************
     * Trace a string or a number => Alternative to console.log().
     * @param s [the string or number to trace]
     ********************************************************************/
    trace(s) {
        if (typeof s === "number") {
            s = s.toString();
        }
        this.print(s, 0, 0, 12);
    }
    /********************************************************************
     * Load a spritesheet.
     * @param n    [name of the spritesheet]
     * @param p    [path of the spritesheet]
     * @param size [size of the sprites in the spritesheet]
     ********************************************************************/
    load(n, p, size) {
        this.spriteSize = size;
        let image = new Image();
        let nameWithPNG = n + ".png";
        let fullPath = p + nameWithPNG;
        image.src = fullPath;
        this.spritesheets.push(image);
    }
    /********************************************************************
     * Create a sprite from spritesheet.
     * @param s  [the choosen sprite]
     * @param x0 [x position of the sprite]
     * @param y0 [y position of the sprite]
     ********************************************************************/
    spr(s, x0, y0) {
        this.cr.renderer.mozImageSmoothingEnabled = false;
        this.cr.renderer.webkitImageSmoothingEnabled = false;
        this.cr.renderer.imageSmoothingEnabled = false;
        let amountFieldsHorizontal = this.spritesheets[0].width / this.spriteSize;
        let yPos = Math.floor(s / amountFieldsHorizontal);
        let xPos = s - amountFieldsHorizontal * yPos;
        this.cr.renderer.drawImage(this.spritesheets[0], xPos * this.spriteSize, yPos * this.spriteSize, 8, 8, x0 * this.cr.options.scaleFactor, y0 * this.cr.options.scaleFactor, this.spriteSize * this.cr.options.scaleFactor, this.spriteSize * this.cr.options.scaleFactor);
    }
    /********************************************************************
     * Get status of key code passed
     * Return true if key is pressed
     * @param  code [key code passed]
     * @return      [true or false]
     ********************************************************************/
    key(code) {
        switch (code) {
            case 0: {
                if (this.inputs.isDown(key_enum_1.KEY.UP)) {
                    return true;
                }
                break;
            }
            case 1: {
                if (this.inputs.isDown(key_enum_1.KEY.DOWN)) {
                    return true;
                }
                break;
            }
            case 2: {
                if (this.inputs.isDown(key_enum_1.KEY.LEFT)) {
                    return true;
                }
                break;
            }
            case 3: {
                if (this.inputs.isDown(key_enum_1.KEY.RIGHT)) {
                    return true;
                }
                break;
            }
            case 4: {
                if (this.inputs.isDown(key_enum_1.KEY.A)) {
                    return true;
                }
                break;
            }
            case 5: {
                if (this.inputs.isDown(key_enum_1.KEY.B)) {
                    return true;
                }
                break;
            }
            case 6: {
                if (this.inputs.isDown(key_enum_1.KEY.X)) {
                    return true;
                }
                break;
            }
            case 7: {
                if (this.inputs.isDown(key_enum_1.KEY.Z)) {
                    return true;
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    /********************************************************************
     * Get status of key code passed
     * Return only true if pressed now and not in previous frame
     * @param  code [Key code passed]
     * @return      [true or false]
     ********************************************************************/
    keyp(code) {
        switch (code) {
            case 0: {
                if (this.inputs.justDown(key_enum_1.KEY.UP)) {
                    return true;
                }
                break;
            }
            case 1: {
                if (this.inputs.justDown(key_enum_1.KEY.DOWN)) {
                    return true;
                }
                break;
            }
            case 2: {
                if (this.inputs.justDown(key_enum_1.KEY.LEFT)) {
                    return true;
                }
                break;
            }
            case 3: {
                if (this.inputs.justDown(key_enum_1.KEY.RIGHT)) {
                    return true;
                }
                break;
            }
            case 4: {
                if (this.inputs.justDown(key_enum_1.KEY.A)) {
                    return true;
                }
                break;
            }
            case 5: {
                if (this.inputs.justDown(key_enum_1.KEY.B)) {
                    return true;
                }
                break;
            }
            case 6: {
                if (this.inputs.justDown(key_enum_1.KEY.X)) {
                    return true;
                }
                break;
            }
            case 7: {
                if (this.inputs.justDown(key_enum_1.KEY.Z)) {
                    return true;
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    sfx() {
        let ctx = new AudioContext();
        let lfo = ctx.createOscillator();
        lfo.frequency.value = 1.0;
        // Create the high frequency oscillator to be modulated
        let hfo = ctx.createOscillator();
        hfo.frequency.value = 440.0;
        // Create a gain node whose gain determines the amplitude of the modulation signal
        let modulationGain = ctx.createGain();
        modulationGain.gain.value = 50;
        // Configure the graph and start the oscillators
        lfo.connect(modulationGain);
        modulationGain.connect(hfo.detune);
        hfo.connect(ctx.destination);
        hfo.start(0);
        lfo.start(0);
    }
    /********************************************************************
     * Return the mouse coordinates.
     * @param  e [description]
     * @return   [The mouse coordinates]
     ********************************************************************/
    mouse() {
        return this.inputs.getMousePosition();
    }
    /********************************************************************
     * Get the game width in pixels
     * @return [game width]
     ********************************************************************/
    ggw() {
        return this.cr.canvas.width / this.cr.options.scaleFactor;
    }
    /********************************************************************
     * Get the game height in pixels
     * @return [game height]
     ********************************************************************/
    ggh() {
        return this.cr.canvas.height / this.cr.options.scaleFactor;
    }
    ticks() {
        return this.passedTicks;
    }
    rnd(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /********************************************************************
     * Color Range Error (100%)
     * Check if the selected color is between 0 and 15.
     * @param c [the color to check]
     ********************************************************************/
    colorRangeError(c) {
        if (c < 0 || c > 15) {
            throw new RangeError("You have selected an incorrect color index (" +
                c +
                "). The color must be between 0-15");
        }
    }
    /********************************************************************
     * SPECIAL API FUNCTIONS
     ********************************************************************/
    crc(c, r) {
        let circleDistanceX = Math.abs(c.x - r.x);
        let circleDistanceY = Math.abs(c.y - r.y);
        if (circleDistanceX > r.w / 2 + c.r) {
            return false;
        }
        if (circleDistanceY > r.h / 2 + c.r) {
            return false;
        }
        if (circleDistanceX <= r.w / 2) {
            return true;
        }
        if (circleDistanceY <= r.h / 2) {
            return true;
        }
        let cornerDistance_sq = (circleDistanceX - r.w / 2) * (circleDistanceX - r.w / 2) +
            (circleDistanceY - r.h / 2) * (circleDistanceY - r.h / 2);
        return cornerDistance_sq <= c.r * c.r;
    }
    rrc(r1, r2) {
        if (r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y) {
            return true;
        }
        return false;
    }
    anim(object, startFrame, numberOfFrames, speed) {
        if (!object.a_ct) {
            object.a_ct = 0;
        }
        if (!object.a_st) {
            object.a_st = 0;
        }
        object.a_ct += 1;
        if (object.a_ct % (30 / speed) == 0) {
            object.a_st += 1;
            if (object.a_st == numberOfFrames)
                object.a_st = 0;
        }
        object.a_fr = startFrame + object.a_st;
        this.spr(object.a_fr, object.x, object.y);
    }
    calculateAlphaHexCode(a) {
        a = Math.round(a * 100) / 100;
        var alpha = Math.round(a * 255);
        var hex = (alpha + 0x10000)
            .toString(16)
            .substr(-2)
            .toUpperCase();
        return hex;
    }
}
exports.API = API;
