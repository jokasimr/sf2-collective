
/** a prescribed normalization */
const C = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

/** relative luminosity */
const L = ([r, g, b]) => 0.2126 * C(r / 255) + 0.7152 * C(g / 255) + 0.0722 * C(b / 255);

/** contrast ratio */
export const CR = (a, b) =>
    L(a) > L(b) ?
        (L(a) + 0.05) / (L(b) + 0.05) :
        (L(b) + 0.05) / (L(a) + 0.05);


const argMin = array =>
    array
        .map((e, i) => [e, i])
        .reduce((min, ei) => ei[0] < min[0] ? ei : min)
        [1];

const count = array =>
    array
        .reduce((counter, v) =>
            counter.has(v) ?
                counter.set(v, counter.get(v) + 1) :
                counter.set(v, 1),
            new Map()
        );

const zip = (...a) => a[0].map((_, i) => a.map(x => x[i]));


const median = d => {
  if (d.length < 2) return d[0];

  const ceil = Math.ceil(d.length / 2);
  const floor = Math.floor(d.length / 2);

  const sorted = [...d].sort();
  return (sorted[ceil] + sorted[floor]) / 2;
}


export function colorClosestToMedian(r, g, b) {

    const colorMedian = [r, g, b].map(median);

    const squareDist = (a, b) => a
        .map((_, i) => Math.pow(a[i] - b[i], 2))
        .reduce((s, v) => s + v, 0);

    const i = argMin(zip(r, g, b).map(c => squareDist(c, colorMedian)));

    return [r[i], g[i], b[i]];
}

