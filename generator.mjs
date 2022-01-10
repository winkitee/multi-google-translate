import fs from 'fs';

export function writeLocalizationKeys(readPath, writePath) {
    return new Promise(resolve => {
        readLocailzationFile(readPath, (data) => {

            const dataArray = data.split("/*")
            const strings = [];
            dataArray.forEach((str => {
                let [front, back] = str.split(" = ")
                if (back && back != "") {
                    back = back.replace(/"|;|\n/g, "")
                    strings.push(back);
                }
            }));

            fs.writeFile(writePath, JSON.stringify(strings, null, 2), (err) => {
                if (err) {
                    console.log(err)
                    resolve("")
                } else {
                    console.log(`success: ${writePath}`)
                    resolve(strings)
                }
            })
        });
    })
}

export function readLocailzationFile(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            typeof callback == "function" && callback(data)
        }
    });
}

export function generateTranslatedFile(originalPath, translations, target) {
    const dateString = new Date().toISOString().slice(0, 16)
    const dir = `xcode_${dateString}`
    !fs.existsSync(dir) && fs.mkdirSync(dir)

    readLocailzationFile(originalPath, (data) => {
        const array = data.split("\n\n")
        const comments = []
        array.forEach(value => { 
            let [front] = value.split(" = ")
            if (front) {
                comments.push(front)
            }
        })

        let stringArray = []
        comments.forEach((value, i) => {
            const translation = translations[i]
            stringArray.push(value)
            stringArray.push(" = ")
            stringArray.push(`"${translation}";`)
            stringArray.push("\n\n")
        })

        let stringValue = stringArray.join("###")

        stringValue = stringValue.replace(/###/g, "")
        stringValue = stringValue.replace(/％/g, "%")

        const stringPath = `./${dir}/${target}.strings`
        fs.writeFile(stringPath, stringValue, "utf-8", (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`success: ${stringPath}`)
            }
        })
    })
}

export async function jsonGenerateTranslatedFile(originalPath, targets, translateText) {
    const dateString = new Date().toISOString().slice(0, 16)
    const dir = `JSON_${dateString}`
    !fs.existsSync(dir) && fs.mkdirSync(dir)

    readLocailzationFile(originalPath, async (data) => {
        try {
            const strings = Object.keys(obj)
            for (const target of targets) {
                const stringPath = `./${dir}/${target}.json`
                const translated = await translateText(strings, target)

                const newObj = {}
                strings.forEach((value, i) => {
                    newObj[value] = translated[i]
                })

                fs.writeFile(stringPath, JSON.stringify(newObj, null, 2), "utf-8", (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(`success: ${stringPath}`)
                    }
                })
            }
        } catch(e) {
            console.log(e)
        }
    })
}

export async function translateXcodeLocalizable(path, targets, translateText) {
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
