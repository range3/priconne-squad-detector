const fs = require('fs')
const path = require('path')
const cv = require('opencv4nodejs')
const DescriptorsHelper = require('../helpers/descriptors-helper')

const inDirPath = path.resolve(__dirname, '../assets/face-icons')
const outDirPath = path.resolve(__dirname, '../assets/descriptors')
const dirents = fs.readdirSync(inDirPath, { withFileTypes: true })

const detector = new cv.KAZEDetector()

for (const dirent of dirents) {
  if (dirent.isFile()) {
    console.log(path.join(inDirPath, dirent.name))

    const faceIconMat = cv.imread(path.join(inDirPath, dirent.name))
    const keyPoints = detector.detect(faceIconMat)
    const descriptors = detector.compute(faceIconMat, keyPoints)

    DescriptorsHelper.write(
      path.join(
        outDirPath,
        `${path.basename(dirent.name, path.extname(dirent.name))}.json`),
      descriptors)
  }
}
