/**
 * Converte uma URL de imagem em um objeto File
 * @param url URL da imagem
 * @param fileName Nome do arquivo desejado (ex: 'imagem.jpg')
 * @returns Promise<File>
 */
export async function urlToFile(url: string, fileName: string): Promise<globalThis.File> {
  const response = await fetch(url)
  const blob = await response.blob()

  // O tipo MIME pode ser obtido do blob, ou você pode passar manualmente
  return new File([blob], fileName, { type: blob.type })
}

/**
 * Converte um objeto File em uma URL
 * @param file Objeto File
 * @returns string
 */
export function fileToUrl(file: globalThis.File): string {
  return URL.createObjectURL(file)
}
