'use client'

import { useRef, useEffect, useState, type ChangeEvent } from 'react'
import { AiOutlineDownload, AiOutlineUpload } from 'react-icons/ai'
import {
  canvasToColorTable,
  colorTableToLut,
  drawFileImageToCanvas,
  drawStraightChart,
  getTextDownloadUrl,
} from '../lib/lutGenerator'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasRef2 = useRef<HTMLCanvasElement>(null)
  const inputFileUpload = useRef<HTMLInputElement>(null)
  const [generatedLut, setGeneratedLut] = useState('')
  const [straightChartDataUrl, setStraightChartDataUrl] = useState('')
  const generatedLutDownloadUrl = generatedLut
    ? getTextDownloadUrl(generatedLut)
    : '#'

  useEffect(() => {
    if (!canvasRef.current) return
    drawStraightChart(canvasRef.current)
    setStraightChartDataUrl(canvasRef.current.toDataURL())
  })

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const canvas = canvasRef2.current
    const context = canvas?.getContext('2d')
    if (!e.target?.files || !canvas || !context) return
    await drawFileImageToCanvas(e.target?.files[0], canvas)
    const colorTable = canvasToColorTable(canvas)
    const lut = colorTableToLut(colorTable)
    setGeneratedLut(lut)
    alert('LUTファイルを生成しました！')
  }

  const handleUploadButtonClick = () => {
    inputFileUpload.current?.click()
  }

  return (
    <div className="max-w-lg my-12 mx-auto px-5">
      <header className="mb-10">
        <p className="font-bold text-xl mb-3">3D LUT ジェネレーター</p>
        <p className="">
          紹介するテキスト紹介するテキスト紹介するテキスト紹介するテキスト
        </p>
      </header>
      <section className="mb-12">
        <p className="font-bold mb-3">1. カラーチャートの画像をダウンロード</p>
        {straightChartDataUrl && (
          <div>
            <img src={straightChartDataUrl} alt="chart" />
            <a
              href={straightChartDataUrl}
              download="chart.png"
              type="image/png"
              className="btn btn-primary mt-2"
            >
              <AiOutlineDownload />
              ダウンロード
            </a>
          </div>
        )}
      </section>
      <section className="mb-12">
        <p className="font-bold mb-3">2. カラーチャートの画像を加工</p>
        <p className="mb-3">
          ダウンロードした画像を、LUT化したい色調に加工してください。Photoshopやスマホアプリのフィルターなどもお使いいただけます。
        </p>
      </section>
      <section className="mb-12">
        <p className="font-bold mb-3">3. 加工した画像をアップロード</p>
        <button
          onClick={handleUploadButtonClick}
          type="button"
          className="btn btn-primary"
        >
          <AiOutlineUpload />
          アップロード
        </button>
        <input
          ref={inputFileUpload}
          type="file"
          placeholder="file"
          onChange={(e) => handleUpload(e)}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
      </section>
      <section>
        <p className="font-bold mb-3">4. LUTファイルをダウンロード</p>
        <p className="mb-3">
          下のボタンから、生成されたLUTファイルをダウンロードしてください。DaVinci
          Resolveなど、LUTを使えるソフトウェアでお楽しみいただけます！
        </p>
        <a
          className={`btn btn-primary ${!generatedLut && 'btn-disabled'}`}
          download="generatedLut.cube"
          href={generatedLutDownloadUrl}
        >
          <AiOutlineDownload />
          LUTをダウンロード
        </a>
      </section>

      <div className="hidden">
        <canvas height={1080} width={1920} ref={canvasRef} />
        <canvas height={1080} width={1920} ref={canvasRef2} />
      </div>
    </div>
  )
}
