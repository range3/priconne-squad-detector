const fs = require('fs')
const cv = require('opencv4nodejs')

class DescriptorsHelper {
  static write (filePath, descriptors) {
    fs.writeFileSync(
      filePath,
      DescriptorsHelper.stringify(descriptors))
  }

  static read (filePath) {
    return DescriptorsHelper.parse(fs.readFileSync(filePath, 'utf-8'))
  }

  static stringify (descriptors) {
    return JSON.stringify({
      descriptors: descriptors.getData().toString('base64'),
      rows: descriptors.rows,
      cols: descriptors.cols,
      type: descriptors.type,
    })
  }

  static toMat (obj) {
    // console.log(require('util').inspect(obj, false, null, true))
    const {
      descriptors,
      rows,
      cols,
      type,
    } = obj
    return new cv.Mat(Buffer.from(descriptors, 'base64'), rows, cols, type)
  }
}

module.exports = DescriptorsHelper
