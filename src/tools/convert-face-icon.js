const fs = require('fs')
const path = require('path')
const cv = require('opencv4nodejs')

const inDirPath = path.resolve(__dirname, '../assets/face-icons-unprocessed')
const outDirPath = path.resolve(__dirname, '../assets/face-icons')
const dirents = fs.readdirSync(inDirPath, { withFileTypes: true })

for (const dirent of dirents) {
  if (dirent.isFile()) {
    console.log(path.join(inDirPath, dirent.name))

    const beforeMat = cv.imread(path.join(inDirPath, dirent.name))
    cv.imwrite(
      path.join(outDirPath, dirent.name),
      beforeMat
        .getRegion(new cv.Rect(660, 196, 113, 113)))
  }
}
