let brh = 0;

function random(min, max) {
    return min + Math.random() * (max - min);
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function getMassWagon(state) {
    switch (state) {
        case 0:
            return randomInt(400, 801);
        case 1:
            return randomInt(801, 1201);
        case 2:
            return randomInt(1201, 1601);
        default:
            break;
    }
}

function getLength(state) {
    switch (state) {
        case 0:
            return randomInt(300, 501);
        case 1:
            return randomInt(501, 601);
        case 2:
            return randomInt(601, 701);
        case 3:
            return randomInt(701, 816);
        default:
            break;
    }
}

function calcValues(lstate, mstate) {
    brh = (randomInt(70, 85) + 0.4) / 100;
    let massTfz = randomInt(70, 91);
    if (mstate == undefined) {
        var massState = randomInt(0, 3);
    }
    else {
        var massState = mstate;
    }
    if (lstate == undefined) {
        var lengthState = randomInt(0, 4);
    }
    else {
        var lengthState = lstate;
    }
    let massWagon = getMassWagon(massState);
    let length = getLength(lengthState);
    let g = getGP(brh, massTfz, massWagon, lengthState, massState);
    if (g === null) {
        return null;
    }
    let brh_new = calcBRH(length, massTfz, massWagon, g[0], g[1], g[2], g[3]);
    return {
        length: length,
        massTfz: massTfz,
        massWagon: massWagon,
        PTfz: g[0],
        GTfz: g[2],
        PWagon: g[1],
        GWagon: g[3],
        BrH: brh,
        BrH_new: brh_new
    }
}

function getGP(brh, ml, mw, lstate, mstate) {
    let counter = 0, g = 0, gl = 0, gw = 0, pw = 0, pl = 0, afact = 0.75, bfact = 1;
    switch (lstate) {
        case 1:
            bfact = 0.95;
            break;
        case 2:
            bfact = 0.9;
            break;
        case 3:
            afact *= 0.95;
            bfact = 0.81;
            break;
        default:
            break;
    }
    switch (mstate) {
        case 0:
            gw = randomInt(mw * 0.1, mw * 0.25);
            let p = Math.floor((brh * (ml + mw) - afact * gw) / bfact);
            while ((pl < 0.9 * ml || pl > 1.1 * ml) && (pw < 0.7 * mw || pw > 0.9 * mw)) {
                pl = randomInt(ml * 0.8, ml * 1.2);
                pw = p - pl;
                counter++;
                if (counter > 20) {
                    return null;
                }
            }
            // return null;
            return [pl, pw, randomInt(ml * 0.5, ml * 0.8), gw];
        case 1:
        case 2:
            pl = randomInt(ml * 0.8, ml * 1.2);
            pw = randomInt(mw * 0.6, mw * 0.9);
            g = Math.floor(((brh * (ml + mw)) - (bfact * pw)) / afact);
            console.log(g);
            while ((gl < 0.5 * ml || gl > 0.8 * ml) && (gw < 0.3 * mw || gw > 0.6 * mw)) {
                gl = randomInt(0 * g, 0.3 * g);
                gw = g - gl;
                counter++;
                if (counter > 20) {
                    return null;
                }
            }
            return [pl, pw, gl, gw];
        default:
            break;
    }
}

// 

function calcBRH(l, ml, mw, pl, pw, gl, gw) {
    let a = 0.75, b = 1, c = 0;
    if (l >= 501 && l <= 600) {
        b *= 0.95;
    }
    else if (l >= 601 && l <= 700) {
        b *= 0.9;
    }
    else if (l >= 701) {
        b *= 0.81;
        a *= 0.95;
    }
    if (mw >= 801) {
        c = a * (gl + gw) + b * pw;
    }
    else {
        c = a * gw + b * (pl + pw);
    }
    console.log({a, gl, gw, b, pl, pw, ml, mw, c, m: (ml + mw)});
    return c / (ml + mw);
}

function newValues() {
    document.querySelector('#check').classList.remove("correct", "false");
    document.querySelector('#check').textContent = "";
    let a = null;
    while ((a = calcValues()) == null) {

    }
    brh = a.BrH_new;
    document.querySelector('#length').textContent = a.length.toString();
    document.querySelector('#massTfz').textContent = a.massTfz.toString();
    document.querySelector('#PTfz').textContent = a.PTfz.toString();
    document.querySelector('#GTfz').textContent = a.GTfz.toString();
    document.querySelector('#massWagon').textContent = a.massWagon.toString();
    document.querySelector('#PWagon').textContent = a.PWagon.toString();
    document.querySelector('#GWagon').textContent = a.GWagon.toString();
    console.log(a);
}

window.onload = newValues;

function checkBrh() {
    if (document.querySelector('#brh').value == Math.floor(brh * 100)) {
        document.querySelector('#check').classList.add("correct");
        document.querySelector('#check').classList.remove("false");
        document.querySelector('#check').textContent = "Richtig!";
    }
    else {
        document.querySelector('#check').classList.remove("correct");
        document.querySelector('#check').classList.add("false");
        document.querySelector('#check').textContent = "Falsch!";
    }
}