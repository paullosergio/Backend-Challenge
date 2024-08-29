export interface IImageService {
    getImagePath(imageUuid: string): string
    saveImage(base64Image: string, measure_uuid: string): string,
    scheduleImageDeletion(pathToSaveImage: string): void
}