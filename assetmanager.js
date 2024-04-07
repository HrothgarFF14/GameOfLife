class AssetManager {
    /**
     * Constructs the AssetManager class
     */
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    }

    /**
     * Add asset's path to download queue
     * @param {String} path
     */
    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    }

    /**
     * Check if queued assets have finished
     * @returns boolean value
     */
    isDone() {
        return (
            this.downloadQueue.length === this.successCount + this.errorCount
        );
    }

    /**
     * Start loading all queued assets, executing a callback when all are processed
     * @param callback
     */
    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const img = new Image();

            const path = this.downloadQueue[i];
            console.log(path);

            img.addEventListener("load", () => {
                console.log("Loaded " + img.src);
                this.successCount++;
                if (this.isDone()) callback();
            });

            img.addEventListener("error", () => {
                console.log("Error loading " + img.src);
                this.errorCount++;
                if (this.isDone()) callback();
            });

            img.src = path;
            this.cache[path] = img;
        }
    }

    /**
     * Retrieve loaded asset from the cache by path
     * @param {String} path
     * @returns String path
     */
    getAsset(path) {
        return this.cache[path];
    }
}
