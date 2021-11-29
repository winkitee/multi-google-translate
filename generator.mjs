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
    !fs.existsSync(dateString) && fs.mkdirSync(dateString)
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

        let stringValue = stringArray.join()

        stringValue = stringValue.replace(/,/g, "")
        stringValue = stringValue.replace(/％/g, "%")

        const stringPath = `./${dateString}/${target}.text`
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
    !fs.existsSync(dateString) && fs.mkdirSync(dateString)

    readLocailzationFile(originalPath, async (data) => {
        try {
            const obj = JSON.parse(data)
            const translations = Object.keys(obj)
            
            for (const target of targets) {
                const stringPath = `./${dateString}/${target}.text`
                const translated = await translateText(translations, target)

                const newObj = {}
                translations.forEach((value, i) => {
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