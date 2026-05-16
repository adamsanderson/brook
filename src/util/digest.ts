// Pillaged from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

export async function digest(message: string, algorithm = "SHA-256") {
    const encoded = new TextEncoder().encode(message)
    const hashBuffer = await globalThis.crypto.subtle.digest(algorithm, encoded) // hash the message

    // TODO: Use `toHex` (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toHex)
    //       once TS target has been updated.
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    return hashHex
}