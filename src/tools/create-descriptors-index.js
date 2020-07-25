const fs = require('fs')
const path = require('path')
// const camelCase = require('camelcase')

const dirPath = path.resolve(__dirname, '../assets/descriptors')
const dirents = fs.readdirSync(dirPath, { withFileTypes: true })

fs.writeFileSync(path.join(dirPath, 'index.js'),
  'module.exports = [\n' +
  dirents
    .filter(dirent => dirent.name !== 'index.js')
    .map(dirent => {
      const id = path.basename(dirent.name, path.extname(dirent.name))
      // const camelName = camelCase(id)
      // return `exports.${camelName} = require('./${dirent.name}')`
      return `  { id: '${id}', descriptors: require('./${dirent.name}') },\n`
    }).join('') + ']\n')
