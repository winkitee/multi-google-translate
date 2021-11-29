import fs from "fs"
import googleTranslate from "@google-cloud/translate"
import { writeLocalizationKeys, generateTranslatedFile } from "./generator.mjs"

const { Translate } = googleTranslate.v2
const translate = new Translate()

function readCount() {
    return new Promise((resolve) => {
        fs.readFile("./count.json", "utf-8", (err, data) => {
            if (err) {
                resolve(0)
            } else {
                const obj = JSON.parse(data)
                resolve(obj.count || 0)
            }
        })
    })
}

async function writeCount(count) {
    try {
        const currentCount = await readCount()
        const newObj = { count: currentCount + count }
        fs.writeFile("./count.json", JSON.stringify(newObj), (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`success: ./count.json`)
            }
        })
    } catch (e) {
        console.log(e)
    }
}

function textCount(text) {
    let count = 0
    if (Array.isArray(text)) {
        text.forEach(value => { count += value.length })
    } else {
        count = text.length
    }
    return count
}

async function translateText(text, target) {
    let [translations] = await translate.translate(text, target)
    translations = Array.isArray(translations) ? translations : [translations]
    console.log("Translations:")
    translations.forEach((translation, i) => {
        console.log(`${i} => (${target}) ${translation}`)
    })
    return translations
}

async function main(path, targets) {
    const texts = await writeLocalizationKeys(path, "./en.json")
    const count = textCount(texts)

    for (const target of targets) {
        writeCount(count)
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
main(path, targets)

async function sentence() {
    for (const target of targets) {
        await translateText(`
Fixed a bug.
        `, target)
    }
}

sentence()