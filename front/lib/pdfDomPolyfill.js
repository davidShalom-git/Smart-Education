/**
 * pdfjs-dist legacy build touches browser globals during module init.
 * Node / Vercel have no DOMMatrix — install minimal stubs before importing pdf.mjs.
 */
export function installPdfDomPolyfills() {
    if (typeof globalThis.DOMMatrix !== 'undefined') return;

    globalThis.DOMMatrix = class DOMMatrix {
        constructor() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
            this.m11 = 1;
            this.m12 = 0;
            this.m13 = 0;
            this.m14 = 0;
            this.m21 = 0;
            this.m22 = 1;
            this.m23 = 0;
            this.m24 = 0;
            this.m31 = 0;
            this.m32 = 0;
            this.m33 = 1;
            this.m34 = 0;
            this.m41 = 0;
            this.m42 = 0;
            this.m43 = 0;
            this.m44 = 1;
        }

        multiplySelf() {
            return this;
        }

        preMultiplySelf() {
            return this;
        }

        translateSelf() {
            return this;
        }

        scaleSelf() {
            return this;
        }

        scale3dSelf() {
            return this;
        }

        rotateSelf() {
            return this;
        }

        rotateFromVectorSelf() {
            return this;
        }

        rotateAxisAngleSelf() {
            return this;
        }

        skewXSelf() {
            return this;
        }

        skewYSelf() {
            return this;
        }

        invertSelf() {
            return this;
        }

        flipX() {
            return this;
        }

        flipY() {
            return this;
        }

        static fromMatrix() {
            return new DOMMatrix();
        }
    };
}
