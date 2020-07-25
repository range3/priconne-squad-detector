# priconne-squad-detector
## Usage
```js
const cv = require('opencv4nodejs')
const PriconneSquadDetector = require('@range3/priconne-squad-detector')

;(async () => {
  const screenMat = await cv.imreadAsync('./screen.jpg', cv.IMREAD_COLOR)

  const detector = new PriconneSquadDetector()
  const result = detector.detect(screenMat)

  console.log(
    result
      .slice(0, 5)
      .sort((a, b) => b.position - a.position)
      .map(c => c.name)
      .join(' '),
  )
})()
  .catch(err => console.error(err))
```

## Known issues
- https://github.com/justadudewhohacks/opencv4nodejs/issues/649
