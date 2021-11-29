import googleTranslate from "@google-cloud/translate"
import { writeLocalizationKeys, generateTranslatedFile, jsonGenerateTranslatedFile } from "./generator.mjs"

const { Translate } = googleTranslate.v2
const translate = new Translate()

async function translateText(text, target) {
    let [translations] = await translate.translate(text, target)
    translations = Array.isArray(translations) ? translations : [translations]
    console.log("Translations:")
    translations.forEach((translation, i) => {
        console.log(`${i} => (${target}) ${translation}`)
    })
    return translations
}

async function translateXcodeLocalizable(path, targets) {
    const texts = await writeLocalizationKeys(path, "./en.json")

    for (const target of targets) {
        const translations = []
        for (const text of texts) {
            const translation = await translateText(text, target)
            translations.push(translation)
        }
        generateTranslatedFile(path, translations, target)
    }
}

const path = "./en.text"
const targets = ["en", "de", "fr", "es", "id", "it", "ru", "vi", "ja", "zh-CN", "zh-TW"]
translateXcodeLocalizable(path, targets)

// jsonGenerateTranslatedFile('./en.json', targets, translateText)

// async function sentence() {
//     for (const target of targets) {
//         await translateText(`
// Fixed a bug.
//         `, target)
//     }
// }
// sentence()