import levenshtein from "js-levenshtein";

export function similarity(a: string, b: string): number {
    // Normalization
    a = a.toLowerCase().trim().replace(/\s+/g, ' ');
    b = b.toLowerCase().trim().replace(/\s+/g, ' ');
    
    if (!a || !b) return 0;
    if (a === b) return 1;

    // 1. Jaro-Winkler similarity (good for prefix matches)
    const jaroWinklerScore = jaroWinkler(a, b);
    
    // 2. Normalized Levenshtein (edit distance)
    const levDistance = levenshtein(a, b);
    const maxLength = Math.max(a.length, b.length);
    const levScore = 1 - (levDistance / maxLength);
    
    // 3. Token-based Jaccard similarity
    const tokensA = new Set(a.split(/\s+/));
    const tokensB = new Set(b.split(/\s+/));
    const intersection = new Set([...tokensA].filter(t => tokensB.has(t)));
    const union = new Set([...tokensA, ...tokensB]);
    const jaccardScore = union.size > 0 ? intersection.size / union.size : 0;
    
    // 4. N-gram similarity (bi-grams)
    const ngramScore = ngramSimilarity(a, b, 2);
    
    // 5. Combined score with empirically determined weights
    const combinedScore = 
        0.40 * jaroWinklerScore +  // Strong weight for prefix matches
        0.30 * levScore +          // Edit distance importance
        0.20 * jaccardScore +      // Token overlap
        0.10 * ngramScore;         // Character sequence similarity
    
    return Math.min(1, Math.max(0, combinedScore)); // Clamp to [0,1]
}

function jaroWinkler(s1: string, s2: string, prefixScale: number = 0.1): number {
    if (s1 === s2) return 1.0;
    
    // Jaro distance
    const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    const s1Matches: boolean[] = new Array(s1.length).fill(false);
    const s2Matches: boolean[] = new Array(s2.length).fill(false);

    let matches = 0;
    let transpositions = 0;

    for (let i = 0; i < s1.length; i++) {
        const start = Math.max(0, i - matchDistance);
        const end = Math.min(i + matchDistance + 1, s2.length);
        
        for (let j = start; j < end; j++) {
            if (s2Matches[j] || s1[i] !== s2[j]) continue;
            s1Matches[i] = true;
            s2Matches[j] = true;
            matches++;
            break;
        }
    }

    if (matches === 0) return 0.0;

    let k = 0;
    for (let i = 0; i < s1.length; i++) {
        if (!s1Matches[i]) continue;
        while (!s2Matches[k]) k++;
        if (s1[i] !== s2[k]) transpositions++;
        k++;
    }

    const jaro = (
        (matches / s1.length) +
        (matches / s2.length) + 
        ((matches - transpositions / 2) / matches)
    ) / 3;

    // Winkler modification for common prefix
    const prefixLength = Math.min(4, commonPrefixLength(s1, s2));
    return jaro + (prefixLength * prefixScale * (1 - jaro));

    function commonPrefixLength(a: string, b: string): number {
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i++;
        return i;
    }
}

function ngramSimilarity(s1: string, s2: string, n: number = 2): number {
    if (s1.length < n || s2.length < n) {
        // Fallback to Jaccard for single characters
        const set1 = new Set(s1.split(''));
        const set2 = new Set(s2.split(''));
        const intersection = new Set([...set1].filter(c => set2.has(c)));
        const union = new Set([...set1, ...set2]);
        return union.size > 0 ? intersection.size / union.size : 0;
    }

    const getNGrams = (str: string): Set<string> => {
        const ngrams = new Set<string>();
        for (let i = 0; i <= str.length - n; i++) {
            ngrams.add(str.substring(i, i + n));
        }
        return ngrams;
    };

    const ngrams1 = getNGrams(s1);
    const ngrams2 = getNGrams(s2);
    
    // Dice coefficient
    let intersection = 0;
    ngrams1.forEach(gram => {
        if (ngrams2.has(gram)) intersection++;
    });

    return (2 * intersection) / (ngrams1.size + ngrams2.size);
}