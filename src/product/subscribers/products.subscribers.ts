import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, RemoveEvent, DataSource, LoadEvent } from 'typeorm';
import { Product } from '../entities/product.entity';
import { StorageService } from 'src/files/storage/storage.service';
import { FilePath } from 'src/files/util/file.constants';
import { join } from 'path';
import { pathExists } from 'fs-extra';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface<Product> {
    constructor(private readonly dataSource: DataSource,
        private readonly storageService: StorageService) {
    }

    /**
     * Indicates that this subscriber only listen to Product events.
     */
    listenTo() {
        return Product;
    }

    async afterLoad(entity: Product) {
        const imagesFilenames = await this.getImagesFilenames(entity.id)
        entity[this.IMAGES_FILENAMES_KEY] = imagesFilenames
    }

    private readonly IMAGES_FILENAMES_KEY = 'imagesFilenames'



    private async getImagesFilenames(id: number) {
        const { BASE, IMAGES } = FilePath.Products
        const path = join(BASE, id.toString(), IMAGES)

        if (!await pathExists(path)) {
            return
        }

        return this.storageService.getDirFilenames(path)
    }

}