const cv = require('opencv4nodejs')
const PriconneSquadDetector = require('./priconne-squad-detector')

;(async () => {
  const screenMat = await cv.imreadAsync('./screen.jpg', cv.IMREAD_COLOR)

  const detector = new PriconneSquadDetector()
  const result = detector.detect(screenMat)

  console.log(
    result
      .slice(0, 5)
      .sort((a, b) => b.position - a.position)
      .map(c => c.id)
      .join(' '),
  )
})()
  .catch(err => console.error(err))
