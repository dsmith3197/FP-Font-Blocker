// log verbosity control 
const verbose = false;

// HTMLElement
const getBoundingClientRect_T = HTMLElement.prototype.getBoundingClientRect;
const offsetHeightGetter_T = HTMLElement.prototype.__lookupGetter__('offsetHeight');
const offsetWidthGetter_T = HTMLElement.prototype.__lookupGetter__('offsetWidth');

const genericFontFamilies = ['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'];

function getGenericFontFamily(element) {
    if (!element) {
        return '';
    }

    // fetch the font families for the current element
    const f = element.style.getPropertyValue('font-family');
    const fontFamilies = f.replace(/ /g, '').split(',');
    // attempt to extract the first generic font family
    for (let idx in fontFamilies) {
        if (genericFontFamilies.includes(fontFamilies[idx])) {
            return fontFamilies[idx];
        }
    }
    // recursively check parent if a generic font family hasn't been found 
    const r = getGenericFontFamily(element.parentElement);
    if (r == '') {
        return 'sans-serif';
    }
    return r;
}

Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', {
    get: function() {
        const f = this.style.getPropertyValue('font-family');
        const genericFontFamily = getGenericFontFamily(this);
        if (genericFontFamily == '') {
            return offsetWidthGetter_T.call(this);
        }
        const a = offsetWidthGetter_T.call(this);
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

Object.defineProperty(HTMLSpanElement.prototype, "offsetHeight", {
    get: function() {
        const f = this.style.getPropertyValue('font-family');
        const genericFontFamily = getGenericFontFamily(this);
        if (genericFontFamily == '') {
            return offsetHeightGetter_T.call(this);
        }
        const a = offsetHeightGetter_T.call(this);
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

HTMLSpanElement.prototype.getBoundingClientRect = function() {
    const r = getBoundingClientRect_T.call(this);
    r.width = this.offsetWidth;
    r.height = this.offsetHeight;
    return r;
};