const fs = require('fs')
const cv = require('opencv4nodejs')

const matchFeatures = ({ img1, img2, detector, matchFunc }) => {
  const keyPoints1 = detector.detect(img1)
  const keyPoints2 = detector.detect(img2)

  // console.log(JSON.stringify(keyPoints1))

  let descriptors1 = detector.compute(img1, keyPoints1)
  const descriptors2 = detector.compute(img2, keyPoints2)

  // console.log(require('util').inspect(descriptors1, false, null, true))
  // const metaData = new Int32Array([descriptors1.rows, descriptors1.cols, descriptors1.type])
  // const testBuffer = Buffer.concat([Buffer.from(metaData.buffer), descriptors1.getData()])
  // console.log(require('util').inspect(testBuffer, false, null, true))
  // fs.writeFileSync('test', descriptors1.getData())
  // fs.writeFileSync('test', testBuffer)

  // const readBuffer = fs.readFileSync('test')

  // console.log(readBuffer.readInt32LE(0))
  // console.log(readBuffer.readInt32LE(4))
  // console.log(readBuffer.readInt32LE(8))

  const readTest = JSON.parse(fs.readFileSync('test', 'utf-8'))

  // descriptors1 = new cv.Mat(readBuffer.slice(12), descriptors1.rows, descriptors1.cols, descriptors1.type)
  descriptors1 = new cv.Mat(Buffer.from(readTest.descriptor, 'base64'), readTest.rows, readTest.cols, readTest.type)

  const matches = matchFunc(descriptors1, descriptors2)
  // const matches = cv.matchKnnFlannBased(descriptors1, descriptors2, 2)
  //   .filter(([m, n]) => m.distance < 0.75 * n.distance)
  //   .map(m => m[0])
  // console.log(require('util').inspect(matches, false, null, true))

  const bestN = 20
  const bestMatches = matches.sort(
    (match1, match2) => match1.distance - match2.distance,
  ).slice(0, bestN)

  console.log('score: ', bestMatches.reduce((acc, cur) => acc + cur.distance, 0) / bestMatches.length)

  // console.log(require('util').inspect(bestMatches, false, null, true))

  // console.log(require('util').inspect(keyPoints1, false, null, true))

  // const queryPts = bestMatches.map(({ queryIdx }) => keyPoints1[queryIdx].pt)
  const trainPts = bestMatches.map(({ trainIdx }) => keyPoints2[trainIdx].pt)

  // const homographyMat = cv.findHomography(queryPts, trainPts, cv.RANSAC, 5.0)

  const center = trainPts.reduce((acc, cur) => acc.add(cur), new cv.Point(0, 0)).div(trainPts.length)
  img2.drawCircle(center, 50, new cv.Vec(0, 0, 0xFF), 3)
  // console.log(require('util').inspect(center, false, null, true))

  // console.log(require('util').inspect(homographyMat, false, null, true))

  return cv.drawMatches(
    img1,
    img2,
    keyPoints1,
    keyPoints2,
    bestMatches,
  )
}

;(async () => {
  const screenMat = await cv.imreadAsync('./screen.jpg', cv.IMREAD_COLOR)
  const characterMat = await cv.imreadAsync('./anna.png', cv.IMREAD_COLOR)
  // const characterMat = await cv.imreadAsync('./cristina.png', cv.IMREAD_COLOR)
  // const characterMat = await cv.imreadAsync('./kyaru-new-year.png', cv.IMREAD_COLOR)

  const shiftMatched = matchFeatures({
    img1: characterMat,
    img2: screenMat
      .getRegion(new cv.Rect(
        screenMat.cols / 10,
        screenMat.rows * 2 / 3,
        screenMat.cols * 8 / 10,
        screenMat.rows / 3)),
    // detector: new cv.SIFTDetector({ nFeatures: 2000 }),
    detector: new cv.KAZEDetector(),
    // detector: new cv.AKAZEDetector(),
    // detector: new cv.ORBDetector(),
    // detector: new cv.SIFTDetector(),
    // matchFunc: cv.matchFlannBased,
    matchFunc: cv.matchBruteForce,
  })

  await cv.imwriteAsync('./output.jpg', shiftMatched)

  // const matched = await screenMat.matchTemplateAsync(characterMat, 5)
  // const minMax = matched.minMaxLoc()
  // console.log(require('util').inspect(minMax, false, null, true))
  // const { minLoc: { x, y } } = minMax

  // // Draw bounding rectangle
  // screenMat.drawRectangle(
  //   new cv.Rect(x, y, characterMat.cols, characterMat.rows),
  //   new cv.Vec(0, 255, 0),
  //   2,
  //   cv.LINE_8,
  // )

  // save image
  // await cv.imwriteAsync('./output.jpg', screenMat)

  // Open result in new window
  // cv.imshow('We\'ve found Waldo!', screenMat)
  // cv.waitKey()
})()
  .catch(err => console.error(err))
