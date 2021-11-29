```
{
  "name": "multi-google-translate",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "GOOGLE_APPLICATION_CREDENTIALS=\"[YOUR_KEY_PATH]\" node --experimental-json-modules index.mjs"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@google-cloud/translate": "^6.3.1",
    "node-fetch": "^3.0.0"
  }
}
```

[YOUR_KEY_PATH]에 구글 클라우드 서비스 계정 비공개 키 위치를 넣어주세요.

en.json 또는 en.text를 변경하고 

```javascript
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
```

필요한 부분 주석 제거 후 npm run start를 해주세요.