const fs = require('fs');

(async function() {
    const raw = fs.readFileSync('gemDetails.json')
    const data = JSON.parse(raw)

    const keys = Object.keys(data)

    const out = keys.reduce((acc, cur) => {
        console.log(cur)
        const dataNode = data[cur]
        const displayName = dataNode?.base_item?.display_name
        if (displayName) {
            acc[displayName] = cur
        }
        return acc
    }, {})

    fs.writeFile('gemToTechnicalName.json', JSON.stringify(out, null, 2), () => {})
})();
