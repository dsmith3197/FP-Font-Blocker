// log verbosity control 
const verbose = true;
const random = false;

// HTMLElement
const getBoundingClientRect_T = HTMLElement.prototype.getBoundingClientRect;
const offsetHeightGetter_T = HTMLElement.prototype.__lookupGetter__('offsetHeight');
const offsetWidthGetter_T = HTMLElement.prototype.__lookupGetter__('offsetWidth');

const genericFontFamilies = ['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace', 'sans serif'];

function getGenericFontFamily(element) {
    if (!element) {
        return '';
    }
    // fetch the font families for the current element
    const f = element.style.getPropertyValue('font-family');
    const fontFamilies = f.toLowerCase().replace(/ /g, '').split(',');
    // attempt to extract the first generic font family
    for (let idx in fontFamilies) {
        if (genericFontFamilies.includes(fontFamilies[idx])) {
            return fontFamilies[idx];
        }
    }
    // recursively check parent if a generic font family hasn't been found 
    return getGenericFontFamily(element.parentElement);
}

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: function() {
        if (random) {
            return Math.round(Math.random()*1000);
        }
        const f = this.style.getPropertyValue('font-family');
        const genericFontFamily = getGenericFontFamily(this);
        const a = offsetWidthGetter_T.call(this);
        if (a === 0) {
            return 0;
        }
        this.style.setProperty('font-family', genericFontFamily);
        const r =  offsetWidthGetter_T.call(this);
        if (verbose) {
            console.log("fontFamily: " + f + "; generic font family: " + genericFontFamily);
            console.log("actual width: " + a + ", stated width: " + r);
        }
        this.style.setProperty('font-family', f);
        return r;
    },
});

Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    get: function() {
        if (random) {
            return Math.round(Math.random()*1000);
        }
        const f = this.style.getPropertyValue('font-family');
        const genericFontFamily = getGenericFontFamily(this);
        const a = offsetHeightGetter_T.call(this);
        if (a === 0) {
            return 0;
        }
        this.style.setProperty('font-family', genericFontFamily);
        const r =  offsetHeightGetter_T.call(this);
        if (verbose) {
            console.log("fontFamily: " + f + "; generic font family: " + genericFontFamily);
            console.log("actual width: " + a + ", stated width: " + r);
        }
        this.style.setProperty('font-family', f);
        return r;
    },
});

HTMLElement.prototype.getBoundingClientRect = function() {
    const r = getBoundingClientRect_T.call(this);
    r.width = this.offsetWidth;
    r.height = this.offsetHeight;
    return r;
};