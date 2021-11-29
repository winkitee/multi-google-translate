import googleTranslate from "@google-cloud/translate"
import { translateXcodeLocalizable, jsonGenerateTranslatedFile } from "./generator.mjs"

const { Translate } = googleTranslate.v2
const translate = new Translate()

export async function translateText(text, target) {
    let [translations] = await translate.translate(text, target)
    translations = Array.isArray(translations) ? translations : [translations]
    console.log("Translations:")
    translations.forEach((translation, i) => {
        console.log(`${i} => (${target}) ${translation}`)
    })
    return translations
}

const targets = ["en", "de", "fr", "es", "id", "it", "ru", "vi", "ja", "zh-CN", "zh-TW"]

translateXcodeLocalizable("./en.text", targets, translateText)

// jsonGenerateTranslatedFile('./en.json', targets, translateText)

// async function sentence() {
//     for (const target of targets) {
//         await translateText(`
// Fixed a bug.
//         `, target)
//     }
// }
// sentence()