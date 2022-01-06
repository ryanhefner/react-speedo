# react-speedo

Tooling to help you monitor the performance of your React applications.

## Install

Via [npm](https://npmjs.com/package/react-speedo)

```sh
npm install react-speedo
```

Via [Yarn](https://yarn.pm/react-speedo)

```sh
yarn add react-speedo
```

## How to use

### `useSpeedo` (Hook)

```js
import { useRef, useState } from 'react'
import { useSpeedo } from 'react-speedo'

const YourComponent = () => {
  const { begin, end, value } = useSpeedo()
  const [run, setRun] = useState(true)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const tick = async () => {
      begin()

      ...[some async tasks or other heavy code]

      end()
    }

    if (run && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(tick)
    } else if (!run && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [run])

  return <p>{`${value}fps`}</p>
}

```

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
