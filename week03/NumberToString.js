
function convertNumberToString(number, radix) {
    let integer = Math.floor(number);
    let fraction = String(number).match(/\.\d+$/);
    if (fraction) {
        fraction = fraction[0].replace('.', '');
    }
    let string = '';
    while (integer > 0) {
        string = String(integer % radix) + string;
        integer = Math.floor(integer / radix);
    }
    return fraction ? `${string}.${fraction}` : string;
}