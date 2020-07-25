const faceIconDescriptorsList = require('./assets/descriptors')
const characters = require('./assets/characters')
const DescriptorsHelper = require('./helpers/descriptors-helper')
const cv = require('opencv4nodejs')

class PriconneSquadDetector {
  constructor () {
    this.faceIconDescriptorsList = faceIconDescriptorsList
      .map(item => {
        item.descriptors = DescriptorsHelper.toMat(item.descriptors)
        return item
      })
  }

  detect (img) {
    const imgTrimmed = img.getRegion(new cv.Rect(
      img.cols / 10,
      img.rows * 2 / 3,
      img.cols * 8 / 10,
      img.rows / 3))
    const detector = new cv.KAZEDetector()
    const keyPoints = detector.detect(imgTrimmed)
    const descriptors2 = detector.compute(imgTrimmed, keyPoints)

    return faceIconDescriptorsList
      .map(faceIconDescriptors => {
        const id = faceIconDescriptors.id.replace(/-\d+$/, '')
        const idx = characters.findIndex(c => c.id === id)
        return {
          id,
          did: faceIconDescriptors.id,
          name: characters[idx]?.name,
          position: idx,
          score: this._calcScore(faceIconDescriptors.descriptors, descriptors2),
        }
      })
      .sort((a, b) => a.score - b.score)
  }

  _calcScore (descriptors1, descriptors2) {
    const bestN = 20
    const matched = cv.matchBruteForce(descriptors1, descriptors2)
    return matched
      .sort((m1, m2) => m1.distance - m2.distance)
      .slice(0, bestN)
      .reduce((acc, cur) => acc + cur.distance, 0)
  }
}

module.exports = PriconneSquadDetector
