import { getPkg, getPkgTool, isFile, jsShell } from 'lazy-js-utils'
import ora from 'ora'
import type { Color, Spinner } from 'ora'

const DW = /-DW/
const W = /-W/
const Dw = /-Dw/
const w = /-w/
const D = /-D\s*$/
const d = /-d\s*$/

export async function getParams(params: string) {
  switch (getPkgTool()) {
    case 'pnpm':
      if (isFile('./pnpm-workspace.yaml')) {
        if (D.test(params))
          return params.replace(D, '-Dw')
        if (d.test(params))
          return params.replace(d, '-Dw')
        return `${params} -w`
      }

      if (DW.test(params))
        params = params.replace(DW, '-Dw')
      else if (W.test(params))
        params = params.replace(W, '-w')

      return params
    case 'yarn':
      if ((await getPkg())?.workspaces) {
        if (D.test(params))
          return params.replace(D, '-DW')
        if (d.test(params))
          return params.replace(d, '-DW')
        return `${params} -W`
      }

      if (Dw.test(params))
        params = params.replace(Dw, '-DW')
      else if (W.test(params))
        params = params.replace(w, '-W')
      return params
    default:
      return params
  }
}

export async function loading(text: string) {
  const { color, spinner } = await getStyle()
  const result = ora({
    text,
    spinner,
    color,
    discardStdin: true,
  }).start()
  return result
}

export async function getStyle() {
  const { result: _color = 'yellow' } = await jsShell('echo $PI_COLOR', 'pipe')
  const color = _color as Color
  const { result: _spinner = 'star' } = await jsShell(
    'echo $PI_SPINNER',
    'pipe',
  )
  const spinner = _spinner as unknown as Spinner
  return { color, spinner }
}
