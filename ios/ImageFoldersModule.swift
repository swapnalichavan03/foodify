// import Foundation
// import Photos
// import React

// @objc(ImageFolders)
// class ImageFolders: NSObject {

//     // @objc
//     // func getImagesByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//     //     PHPhotoLibrary.requestAuthorization { status in
//     //         guard status == .authorized || status == .limited else {
//     //             reject("PERMISSION_DENIED", "Photo Library access denied", nil)
//     //             return
//     //         }

//     //         let first = params["first"] as? Int ?? 25
//     //         let after = params["after"] as? String
//     //         let folderIdentifier = params["folderPath"] as? String

//     //         var imagesList: [[String: Any]] = []
//     //         let fetchOptions = PHFetchOptions()
//     //         fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
            
//     //         if let after = after {
//     //             fetchOptions.predicate = NSPredicate(format: "localIdentifier > %@", after)
//     //         }

//     //         if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
//     //             print("Fetching images for album ID: \(folderIdentifier)")

//     //             let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
//     //             if collections.count == 0 {
//     //                 reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
//     //                 return
//     //             }

//     //             collections.enumerateObjects { (collection, _, _) in
//     //                 let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions)
//     //                 print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) images")

//     //                 if assets.count > 0 {
//     //                     self.processAssets(assets, first: first) { processedImages in
//     //                         imagesList.append(contentsOf: processedImages)
//     //                         DispatchQueue.main.async {
//     //                             resolve([
//     //                                 "images": imagesList,
//     //                                 "page_info": [
//     //                                     "has_next_page": processedImages.count == first,
//     //                                     "start_cursor": processedImages.first?["localIdentifier"] as? String ?? "",
//     //                                     "end_cursor": processedImages.last?["localIdentifier"] as? String ?? ""
//     //                                 ]
//     //                             ])
//     //                         }
//     //                     }
//     //                 } else {
//     //                     reject("NO_IMAGES", "No images found in the album", nil)
//     //                 }
//     //             }
//     //         } else {
//     //             // Fetch all images
//     //             let allAssets = PHAsset.fetchAssets(with: .image, options: fetchOptions)
//     //             self.processAssets(allAssets, first: first) { processedImages in
//     //                 imagesList.append(contentsOf: processedImages)
//     //                 DispatchQueue.main.async {
//     //                     resolve([
//     //                         "images": imagesList,
//     //                         "page_info": [
//     //                             "has_next_page": processedImages.count == first,
//     //                             "start_cursor": processedImages.first?["localIdentifier"] as? String ?? "",
//     //                             "end_cursor": processedImages.last?["localIdentifier"] as? String ?? ""
//     //                         ]
//     //                     ])
//     //                 }
//     //             }
//     //         }
//     //     }
//     // }

//     /**
//     @objc
//     func getImagesByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//         PHPhotoLibrary.requestAuthorization { status in
//         guard status == .authorized || status == .limited else {
//             reject("PERMISSION_DENIED", "Photo Library access denied", nil)
//             return
//         }

//         let first = params["first"] as? Int ?? 25
//         let after = params["after"] as? String
//         let folderIdentifier = params["folderPath"] as? String

//         var imagesList: [[String: Any]] = []
//         let fetchOptions = PHFetchOptions()
//         fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        
//         // **Apply filter for only images**
//         var predicates: [NSPredicate] = [
//             NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue)
//         ]
        
//         if let after = after {
//             predicates.append(NSPredicate(format: "localIdentifier > %@", after))
//         }
        
//         fetchOptions.predicate = NSCompoundPredicate(andPredicateWithSubpredicates: predicates)

//         if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
//             print("Fetching images for album ID: \(folderIdentifier)")

//             let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
//             if collections.count == 0 {
//                 reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
//                 return
//             }

//             collections.enumerateObjects { (collection, _, _) in
//                 let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions)
//                 print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) images")

//                 if assets.count > 0 {
//                     self.processAssets(assets, first: first) { processedImages in
//                         imagesList.append(contentsOf: processedImages)
//                         DispatchQueue.main.async {
//                             resolve([
//                                 "images": imagesList,
//                                 "page_info": [
//                                     "has_next_page": processedImages.count == first,
//                                     "start_cursor": processedImages.first?["localIdentifier"] as? String ?? "",
//                                     "end_cursor": processedImages.last?["localIdentifier"] as? String ?? ""
//                                 ]
//                             ])
//                         }
//                     }
//                 } else {
//                     reject("NO_IMAGES", "No images found in the album", nil)
//                 }
//             }
//         } else {
//             // Fetch all images
//             let allAssets = PHAsset.fetchAssets(with: .image, options: fetchOptions)
//             self.processAssets(allAssets, first: first) { processedImages in
//                 imagesList.append(contentsOf: processedImages)
//                 DispatchQueue.main.async {
//                     resolve([
//                         "images": imagesList,
//                         "page_info": [
//                             "has_next_page": processedImages.count == first,
//                             "start_cursor": processedImages.first?["localIdentifier"] as? String ?? "",
//                             "end_cursor": processedImages.last?["localIdentifier"] as? String ?? ""
//                         ]
//                     ])
//                 }
//             }
//         }
//         }
//     }
//     */

//     @objc
//     func getImagesByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//         PHPhotoLibrary.requestAuthorization { status in
//             guard status == .authorized || status == .limited else {
//                 reject("PERMISSION_DENIED", "Photo Library access denied", nil)
//                 return
//             }

//             let first = params["first"] as? Int ?? 25
//             let after = params["after"] as? String
//             let folderIdentifier = params["folderPath"] as? String

//             var imagesList: [[String: Any]] = []
//             let fetchOptions = PHFetchOptions()
//             fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]

//             // **Filter only images**
//             var predicates: [NSPredicate] = [
//                 NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue)
//             ]

//             // **Apply pagination using creationDate instead of localIdentifier**
//           if let after = after, let afterDate = self.getCreationDate(from: after) {
//                 predicates.append(NSPredicate(format: "creationDate < %@", afterDate as NSDate))
//             }

//             fetchOptions.predicate = NSCompoundPredicate(andPredicateWithSubpredicates: predicates)

//             if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
//                 print("Fetching images for album ID: \(folderIdentifier)")

//                 let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
//                 if collections.count == 0 {
//                     reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
//                     return
//                 }

//                 collections.enumerateObjects { (collection, _, _) in
//                     let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions)
//                     print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) images")

//                     if assets.count > 0 {
//                         self.processAssets(assets, first: first) { processedImages in
//                             imagesList.append(contentsOf: processedImages)
//                             DispatchQueue.main.async {
//                                 resolve(self.formatResponse(imagesList, first: first))
//                             }
//                         }
//                     } else {
//                         reject("NO_IMAGES", "No images found in the album", nil)
//                     }
//                 }
//             } else {
//                 // **Fetch all images**
//                 let allAssets = PHAsset.fetchAssets(with: .image, options: fetchOptions)
//                 self.processAssets(allAssets, first: first) { processedImages in
//                     imagesList.append(contentsOf: processedImages)
//                     DispatchQueue.main.async {
//                         resolve(self.formatResponse(imagesList, first: first))
//                     }
//                 }
//             }
//         }
//     }

//     /// **Helper function to get creationDate from an asset localIdentifier**
//     func getCreationDate(from identifier: String) -> Date? {
//         let assets = PHAsset.fetchAssets(withLocalIdentifiers: [identifier], options: nil)
//         return assets.firstObject?.creationDate
//     }

//     /// **Helper function to format response**
//     func formatResponse(_ imagesList: [[String: Any]], first: Int) -> [String: Any] {
//         return [
//             "images": imagesList,
//             "page_info": [
//                 "has_next_page": imagesList.count == first,
//                 "start_cursor": imagesList.first?["localIdentifier"] as? String ?? "",
//                 "end_cursor": imagesList.last?["localIdentifier"] as? String ?? ""
//             ]
//         ]
//     }


//     func processAssets(_ assets: PHFetchResult<PHAsset>, first: Int, completion: @escaping ([[String: Any]]) -> Void) {
//       var imagesList: [[String: Any]] = []
//       let imageManager = PHImageManager.default()
//       let options = PHImageRequestOptions()
//       options.isSynchronous = true
//       options.deliveryMode = .highQualityFormat
//       options.isNetworkAccessAllowed = true

//       var count = 0
//       var imageProcessingGroup = DispatchGroup()

//       assets.enumerateObjects { (asset, _, stop) in
//           guard count < first else {
//               stop.pointee = true
//               return
//           }

//           var imageName = "Unknown"
//           let resources = PHAssetResource.assetResources(for: asset)
//           if let resource = resources.first {
//               imageName = resource.originalFilename
//           }

//           let fileExtension = (imageName as NSString).pathExtension.lowercased()
//           let mimeType = fileExtension == "png" ? "image/png" : "image/jpeg"

//           // Get local file path
//           imageProcessingGroup.enter()
//           imageManager.requestImageDataAndOrientation(for: asset, options: options) { data, _, _, _ in
//               defer { imageProcessingGroup.leave() }

//               guard let data = data else { return }

//               let tempPath = NSTemporaryDirectory() + imageName
//               try? data.write(to: URL(fileURLWithPath: tempPath))

//               let imageInfo: [String: Any] = [
//                   "exif": NSNull(),
//                   "localIdentifier": asset.localIdentifier,
//                   "filename": imageName,
//                   "width": asset.pixelWidth,
//                   "mime": mimeType,
//                   "modificationDate": asset.modificationDate?.timeIntervalSince1970 ?? 0,
//                   "path": tempPath,
//                   "size": data.count,
//                   "sourceURL": "file://\(tempPath)",
//                   "data": NSNull(),
//                   "height": asset.pixelHeight,
//                   "duration": NSNull(),
//                   "creationDate": asset.creationDate?.timeIntervalSince1970 ?? 0
//               ]
//               imagesList.append(imageInfo)
//               count += 1
//           }
//       }

//       imageProcessingGroup.notify(queue: .main) {
//           completion(imagesList)
//       }
//     }

//     @objc
//     func getVideosByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//         PHPhotoLibrary.requestAuthorization { status in
//             guard status == .authorized || status == .limited else {
//             reject("PERMISSION_DENIED", "Photo Library access denied", nil)
//             return
//             }

//             let first = params["first"] as? Int ?? 25
//             let after = params["after"] as? String
//             let folderIdentifier = params["folderPath"] as? String

//             var videosList: [[String: Any]] = []
//             let fetchOptions = PHFetchOptions()
//             fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue) // Only fetch videos

//             if let after = after {
//             fetchOptions.predicate = NSPredicate(format: "localIdentifier > %@", after)
//             }

//             if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
//             print("Fetching videos for album ID: \(folderIdentifier)")

//             let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
//             if collections.count == 0 {
//                 reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
//                 return
//             }

//             collections.enumerateObjects { (collection, _, _) in
//                 let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions) // Fetch only video assets

//                 print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) videos")

//                 if assets.count > 0 {
//                     self.processVideoAssets(assets, first: first) { processedVideos in
//                         videosList.append(contentsOf: processedVideos)
//                         DispatchQueue.main.async {
//                             resolve([
//                                 "videos": videosList,
//                                 "page_info": [
//                                     "has_next_page": processedVideos.count == first,
//                                     "start_cursor": processedVideos.first?["localIdentifier"] as? String ?? "",
//                                     "end_cursor": processedVideos.last?["localIdentifier"] as? String ?? ""
//                                 ]
//                             ])
//                         }
//                     }
//                 } else {
//                     reject("NO_VIDEOS", "No videos found in the album", nil)
//                 }
//             }
//             } else {
//             // Fetch all videos
//             let allAssets = PHAsset.fetchAssets(with: .video, options: fetchOptions)
//             self.processVideoAssets(allAssets, first: first) { processedVideos in
//                 videosList.append(contentsOf: processedVideos)
//                 DispatchQueue.main.async {
//                     resolve([
//                         "videos": videosList,
//                         "page_info": [
//                             "has_next_page": processedVideos.count == first,
//                             "start_cursor": processedVideos.first?["localIdentifier"] as? String ?? "",
//                             "end_cursor": processedVideos.last?["localIdentifier"] as? String ?? ""
//                         ]
//                     ])
//                 }
//             }
//             }
//         }
//     }

//     // Helper function to process video assets
//     private func processVideoAssets(_ assets: PHFetchResult<PHAsset>, first: Int, completion: @escaping ([[String: Any]]) -> Void) {
//     var videosList: [[String: Any]] = []
//     let videoManager = PHImageManager.default()
//     let options = PHVideoRequestOptions()
//     options.isNetworkAccessAllowed = true
//     options.deliveryMode = .highQualityFormat

//     var count = 0
//     var videoProcessingGroup = DispatchGroup()

//     assets.enumerateObjects { (asset, _, stop) in
//         guard count < first else {
//             stop.pointee = true
//             return
//         }

//         // Ensure asset is a video
//         if asset.mediaType == .video {
//             var videoName = "Unknown"
//             let resources = PHAssetResource.assetResources(for: asset)
//             if let resource = resources.first {
//                 videoName = resource.originalFilename
//             }

//             let fileExtension = (videoName as NSString).pathExtension.lowercased()
//             let mimeType = fileExtension == "mp4" ? "video/mp4" : "video/quicktime"

//             // Get local file path
//             videoProcessingGroup.enter()
//             videoManager.requestAVAsset(forVideo: asset, options: options) { (avAsset, _, _) in
//                 defer { videoProcessingGroup.leave() }

//                 if let urlAsset = avAsset as? AVURLAsset {
//                     let videoPath = urlAsset.url.path

//                     let videoInfo: [String: Any] = [
//                         "exif": NSNull(),
//                         "localIdentifier": asset.localIdentifier,
//                         "filename": videoName,
//                         "width": asset.pixelWidth,
//                         "mime": mimeType,
//                         "modificationDate": asset.modificationDate?.timeIntervalSince1970 ?? 0,
//                         "path": videoPath,
//                         "size": NSNull(), // Size is not available directly from PHAsset
//                         "sourceURL": urlAsset.url.absoluteString,
//                         "data": NSNull(),
//                         "height": asset.pixelHeight,
//                         "duration": asset.duration,
//                         "creationDate": asset.creationDate?.timeIntervalSince1970 ?? 0
//                     ]
//                     videosList.append(videoInfo)
//                 }
//             }
//         }
//     }

//     videoProcessingGroup.notify(queue: .main) {
//         completion(videosList)
//     }
//     }

//     // @objc
//     // func getImageFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//     //   PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
//     //       guard status == .authorized || status == .limited else {
//     //           reject("PERMISSION_DENIED", "Photo Library access denied", nil)
//     //           return
//     //       }

//     //       var albumsArray: [[String: Any]] = []
//     //       var seenAlbums = Set<String>() // Track already added album identifiers

//     //       let fetchOptions = PHFetchOptions()

//     //       // Album Types: Regular albums + Smart Albums
//     //       let albumTypes: [PHAssetCollectionType] = [.album, .smartAlbum]

//     //       // Iterate through all album types
//     //       for albumType in albumTypes {
//     //           let collections = PHAssetCollection.fetchAssetCollections(with: albumType, subtype: .any, options: fetchOptions)
//     //           print("Fetched \(collections.count) collections for type \(albumType)")

//     //           collections.enumerateObjects { (collection, _, _) in
//     //               let albumName = collection.localizedTitle ?? "Untitled Album"
//     //               let albumIdentifier = collection.localIdentifier
//     //               let assets = PHAsset.fetchAssets(in: collection, options: nil)

//     //               let imageCount = assets.count

//     //               print("Album: \(albumName), Identifier: \(albumIdentifier), Image Count: \(imageCount)")

//     //               if imageCount > 0 && !seenAlbums.contains(albumIdentifier) {
//     //                   seenAlbums.insert(albumIdentifier)

//     //                   // Fetch the first image in the album
//     //                   var thumbnailPath: String? = nil

//     //                   if let firstAsset = assets.firstObject {
//     //                       let imageRequestOptions = PHImageRequestOptions()
//     //                       imageRequestOptions.isSynchronous = true
//     //                       imageRequestOptions.deliveryMode = .highQualityFormat

//     //                       let imageManager = PHImageManager.default()
//     //                       imageManager.requestImageDataAndOrientation(for: firstAsset, options: imageRequestOptions) { data, _, _, info in
//     //                           if let fileURL = info?["PHImageFileURLKey"] as? URL {
//     //                               thumbnailPath = fileURL.absoluteString
//     //                           }
//     //                       }
//     //                   }

//     //                   let albumInfo: [String: Any] = [
//     //                       "folderPath": "",  // iOS does not expose folder paths
//     //                       "folderIdentifier": albumIdentifier, // Use this to fetch images later
//     //                       "folderName": albumName,
//     //                       "imageCount": imageCount,
//     //                       "thumbnail": thumbnailPath ?? "" // First image from the folder
//     //                   ]
//     //                   albumsArray.append(albumInfo)
//     //               }
//     //           }
//     //       }

//     //       resolve(albumsArray)
//     //   }
//     // }

//     @objc
//     func getImageFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//         PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
//         guard status == .authorized || status == .limited else {
//             reject("PERMISSION_DENIED", "Photo Library access denied", nil)
//             return
//         }

//         var albumsArray: [[String: Any]] = []
//         var seenAlbums = Set<String>() // Track already added album identifiers

//         let fetchOptions = PHFetchOptions()
//         fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue) // Only fetch images

//         // Album Types: Regular albums + Smart Albums
//         let albumTypes: [PHAssetCollectionType] = [.album, .smartAlbum]

//         // Iterate through all album types
//         for albumType in albumTypes {
//             let collections = PHAssetCollection.fetchAssetCollections(with: albumType, subtype: .any, options: nil)

//             collections.enumerateObjects { (collection, _, _) in
//                 let albumName = collection.localizedTitle ?? "Untitled Album"
//                 let albumIdentifier = collection.localIdentifier
//                 let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions) // Apply the filter

//                 let imageCount = assets.count

//                 if imageCount > 0 && !seenAlbums.contains(albumIdentifier) {
//                     seenAlbums.insert(albumIdentifier)

//                     // Fetch the first image in the album
//                     var thumbnailPath: String? = nil

//                     if let firstAsset = assets.firstObject {
//                         let imageRequestOptions = PHImageRequestOptions()
//                         imageRequestOptions.isSynchronous = true
//                         imageRequestOptions.deliveryMode = .highQualityFormat

//                         let imageManager = PHImageManager.default()
//                         imageManager.requestImageDataAndOrientation(for: firstAsset, options: imageRequestOptions) { data, _, _, info in
//                             if let fileURL = info?["PHImageFileURLKey"] as? URL {
//                                 thumbnailPath = fileURL.absoluteString
//                             }
//                         }
//                     }

//                     let albumInfo: [String: Any] = [
//                         "folderPath": "",  // iOS does not expose folder paths
//                         "folderIdentifier": albumIdentifier, // Use this to fetch images later
//                         "folderName": albumName,
//                         "imageCount": imageCount,
//                         "thumbnail": thumbnailPath ?? "" // First image from the folder
//                     ]
//                     albumsArray.append(albumInfo)
//                 }
//             }
//         }

//         resolve(albumsArray)
//         }
//     }
//     /**
//     @objc
//     func getVideoFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//           var videoFolders: [[String: Any]] = []
          
//           let fetchOptions = PHFetchOptions()
//           fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)

//           // Fetch all video assets
//           let videoAssets = PHAsset.fetchAssets(with: .video, options: fetchOptions)

//           // Fetch all albums (user & smart albums)
//           let albumOptions = PHFetchOptions()
//           let albums = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .any, options: albumOptions)
          
//           albums.enumerateObjects { (album, _, _) in
//               let albumIdentifier = album.localIdentifier
//               let albumName = album.localizedTitle ?? "Unknown"
              
//               // Fetch videos in this album
//               let albumFetchOptions = PHFetchOptions()
//               albumFetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)
//               let videoAssetsInAlbum = PHAsset.fetchAssets(in: album, options: albumFetchOptions)
//               let videoCount = videoAssetsInAlbum.count
              
//               if videoCount > 0 {
//                   if let firstAsset = videoAssetsInAlbum.firstObject {
//                       let resources = PHAssetResource.assetResources(for: firstAsset)
//                       if let resource = resources.first {
//                           let url = resource.value(forKey: "privateFileURL") as? URL
//                           let folderPath = url?.deletingLastPathComponent().path ?? "Unknown Path"

//                           let albumInfo: [String: Any] = [
//                               "folderPath": folderPath,
//                               "folderIdentifier": albumIdentifier,
//                               "folderName": albumName,
//                               "imageCount": videoCount
//                           ]
//                           videoFolders.append(albumInfo)
//                       }
//                   }
//               }
//           }
          
//           resolve(videoFolders)
//     }
//     */
    
//     @objc
//     func getVideoFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
//         var videoFolders: [[String: Any]] = []
//         var seenAlbums = Set<String>() // Track already added album identifiers

//         let fetchOptions = PHFetchOptions()
//         fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)

//         // Include both user-created albums and system smart albums
//         let albumTypes: [PHAssetCollectionType] = [.album, .smartAlbum]

//         for albumType in albumTypes {
//         let albums = PHAssetCollection.fetchAssetCollections(with: albumType, subtype: .any, options: nil)

//         albums.enumerateObjects { (album, _, _) in
//             let albumIdentifier = album.localIdentifier
//             let albumName = album.localizedTitle ?? "Unknown Album"

//             // Fetch videos in this album
//             let albumFetchOptions = PHFetchOptions()
//             albumFetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)
//             let videoAssetsInAlbum = PHAsset.fetchAssets(in: album, options: albumFetchOptions)
//             let videoCount = videoAssetsInAlbum.count

//             if videoCount > 0 && !seenAlbums.contains(albumIdentifier) {
//                 seenAlbums.insert(albumIdentifier)

//                 var thumbnailPath: String? = nil

//                 if let firstAsset = videoAssetsInAlbum.firstObject {
//                     let imageRequestOptions = PHImageRequestOptions()
//                     imageRequestOptions.isSynchronous = true
//                     imageRequestOptions.deliveryMode = .highQualityFormat

//                     let imageManager = PHImageManager.default()
//                     imageManager.requestImageDataAndOrientation(for: firstAsset, options: imageRequestOptions) { data, _, _, info in
//                         if let fileURL = info?["PHImageFileURLKey"] as? URL {
//                             thumbnailPath = fileURL.absoluteString
//                         }
//                     }
//                 }

//                 let albumInfo: [String: Any] = [
//                     "folderIdentifier": albumIdentifier,
//                     "folderName": albumName,
//                     "videoCount": videoCount,
//                     "thumbnail": thumbnailPath ?? ""
//                 ]
//                 videoFolders.append(albumInfo)
//             }
//         }
//         }

//         resolve(videoFolders)
//     }
    

//     @objc static func requiresMainQueueSetup() -> Bool {
//         return true
//     }


// }





import Foundation
import AVFoundation
import Photos
import React

@objc(ImageFolders)
class ImageFolders: NSObject {

    @objc
    func getImagesByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        PHPhotoLibrary.requestAuthorization { status in
            guard status == .authorized || status == .limited else {
                reject("PERMISSION_DENIED", "Photo Library access denied", nil)
                return
            }

            let first = params["first"] as? Int ?? 25
            let after = params["after"] as? String
            let folderIdentifier = params["folderPath"] as? String

            var imagesList: [[String: Any]] = []
            let fetchOptions = PHFetchOptions()
            fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]

            // **Filter only images**
            var predicates: [NSPredicate] = [
                NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue)
            ]

            // **Apply pagination using creationDate instead of localIdentifier**
          if let after = after, let afterDate = self.getCreationDate(from: after) {
                predicates.append(NSPredicate(format: "creationDate < %@", afterDate as NSDate))
            }

            fetchOptions.predicate = NSCompoundPredicate(andPredicateWithSubpredicates: predicates)

            if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
                print("Fetching images for album ID: \(folderIdentifier)")

                let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
                if collections.count == 0 {
                    reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
                    return
                }

                collections.enumerateObjects { (collection, _, _) in
                    let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions)
                    print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) images")

                    if assets.count > 0 {
                        self.processAssets(assets, first: first) { processedImages in
                            imagesList.append(contentsOf: processedImages)
                            DispatchQueue.main.async {
                                resolve(self.formatResponse(imagesList, first: first))
                            }
                        }
                    } else {
                        reject("NO_IMAGES", "No images found in the album", nil)
                    }
                }
            } else {
                // **Fetch all images**
                let allAssets = PHAsset.fetchAssets(with: .image, options: fetchOptions)
                self.processAssets(allAssets, first: first) { processedImages in
                    imagesList.append(contentsOf: processedImages)
                    DispatchQueue.main.async {
                        resolve(self.formatResponse(imagesList, first: first))
                    }
                }
            }
        }
    }
    /// **Helper function to get creationDate from an asset localIdentifier**
    func getCreationDate(from identifier: String) -> Date? {
        let assets = PHAsset.fetchAssets(withLocalIdentifiers: [identifier], options: nil)
        return assets.firstObject?.creationDate
    }
    /// **Helper function to format response**
    func formatResponse(_ imagesList: [[String: Any]], first: Int) -> [String: Any] {
        return [
            "images": imagesList,
            "page_info": [
                "has_next_page": imagesList.count == first,
                "start_cursor": imagesList.first?["localIdentifier"] as? String ?? "",
                "end_cursor": imagesList.last?["localIdentifier"] as? String ?? ""
            ]
        ]
    }
    
    func processAssets(_ assets: PHFetchResult<PHAsset>, first: Int, completion: @escaping ([[String: Any]]) -> Void) {
      var imagesList: [[String: Any]] = []
      let imageManager = PHImageManager.default()
      let options = PHImageRequestOptions()
      options.isSynchronous = true
      options.deliveryMode = .highQualityFormat
      options.isNetworkAccessAllowed = true

      var count = 0
      var imageProcessingGroup = DispatchGroup()

      assets.enumerateObjects { (asset, _, stop) in
          guard count < first else {
              stop.pointee = true
              return
          }

          var imageName = "Unknown"
          let resources = PHAssetResource.assetResources(for: asset)
          if let resource = resources.first {
              imageName = resource.originalFilename
          }

          let fileExtension = (imageName as NSString).pathExtension.lowercased()
          let mimeType = fileExtension == "png" ? "image/png" : "image/jpeg"

          // Get local file path
          imageProcessingGroup.enter()
          imageManager.requestImageDataAndOrientation(for: asset, options: options) { data, _, _, _ in
              defer { imageProcessingGroup.leave() }

              guard let data = data else { return }

              let tempPath = NSTemporaryDirectory() + imageName
              try? data.write(to: URL(fileURLWithPath: tempPath))

              let imageInfo: [String: Any] = [
                  "exif": NSNull(),
                  "localIdentifier": asset.localIdentifier,
                  "filename": imageName,
                  "width": asset.pixelWidth,
                  "mime": mimeType,
                  "modificationDate": asset.modificationDate?.timeIntervalSince1970 ?? 0,
                  "path": tempPath,
                  "size": data.count,
                  "sourceURL": "file://\(tempPath)",
                  "data": NSNull(),
                  "height": asset.pixelHeight,
                  "duration": NSNull(),
                  "creationDate": asset.creationDate?.timeIntervalSince1970 ?? 0
              ]
              imagesList.append(imageInfo)
              count += 1
          }
      }

      imageProcessingGroup.notify(queue: .main) {
          completion(imagesList)
      }
    }

    @objc
    func getVideosByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        PHPhotoLibrary.requestAuthorization { status in
        guard status == .authorized || status == .limited else {
            reject("PERMISSION_DENIED", "Photo Library access denied", nil)
            return
        }

        let first = params["first"] as? Int ?? 25
        let after = params["after"] as? String
        let folderIdentifier = params["folderPath"] as? String

        var videosList: [[String: Any]] = []
        let fetchOptions = PHFetchOptions()
        fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue) // Only fetch videos

        if let after = after {
            fetchOptions.predicate = NSPredicate(format: "localIdentifier > %@", after)
        }

        if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
            print("Fetching videos for album ID: \(folderIdentifier)")

            let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
            if collections.count == 0 {
                reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
                return
            }

            collections.enumerateObjects { (collection, _, _) in
                let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions) // Fetch only video assets

                print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) videos")

                if assets.count > 0 {
                    self.processVideoAssets(assets, first: first) { processedVideos in
                        videosList.append(contentsOf: processedVideos)
                        DispatchQueue.main.async {
                            resolve([
                                "videos": videosList,
                                "page_info": [
                                    "has_next_page": processedVideos.count == first,
                                    "start_cursor": processedVideos.first?["localIdentifier"] as? String ?? "",
                                    "end_cursor": processedVideos.last?["localIdentifier"] as? String ?? ""
                                ]
                            ])
                        }
                    }
                } else {
                    reject("NO_VIDEOS", "No videos found in the album", nil)
                }
            }
        } else {
            // Fetch all videos
            let allAssets = PHAsset.fetchAssets(with: .video, options: fetchOptions)
            self.processVideoAssets(allAssets, first: first) { processedVideos in
                videosList.append(contentsOf: processedVideos)
                DispatchQueue.main.async {
                    resolve([
                        "videos": videosList,
                        "page_info": [
                            "has_next_page": processedVideos.count == first,
                            "start_cursor": processedVideos.first?["localIdentifier"] as? String ?? "",
                            "end_cursor": processedVideos.last?["localIdentifier"] as? String ?? ""
                        ]
                    ])
                }
            }
        }
        }
    }

    // Helper function to process video assets
    private func processVideoAssets(_ assets: PHFetchResult<PHAsset>, first: Int, completion: @escaping ([[String: Any]]) -> Void) {
        var videosList: [[String: Any]] = []
        let videoManager = PHImageManager.default()
        let options = PHVideoRequestOptions()
        options.isNetworkAccessAllowed = true
        options.deliveryMode = .highQualityFormat

        var count = 0
        var videoProcessingGroup = DispatchGroup()

        assets.enumerateObjects { (asset, _, stop) in
        guard count < first else {
            stop.pointee = true
            return
        }

        // Ensure asset is a video
        if asset.mediaType == .video {
            var videoName = "Unknown"
            let resources = PHAssetResource.assetResources(for: asset)
            if let resource = resources.first {
                videoName = resource.originalFilename
            }

            let fileExtension = (videoName as NSString).pathExtension.lowercased()
            let mimeType = fileExtension == "mp4" ? "video/mp4" : "video/quicktime"

            // Get local file path
            videoProcessingGroup.enter()
            videoManager.requestAVAsset(forVideo: asset, options: options) { (avAsset, _, _) in
                defer { videoProcessingGroup.leave() }

                if let urlAsset = avAsset as? AVURLAsset {
                    let videoPath = urlAsset.url.path

                    let videoInfo: [String: Any] = [
                        "exif": NSNull(),
                        "localIdentifier": asset.localIdentifier,
                        "filename": videoName,
                        "width": asset.pixelWidth,
                        "mime": mimeType,
                        "modificationDate": asset.modificationDate?.timeIntervalSince1970 ?? 0,
                        "path": videoPath,
                        "size": NSNull(), // Size is not available directly from PHAsset
                        "sourceURL": urlAsset.url.absoluteString,
                        "data": NSNull(),
                        "height": asset.pixelHeight,
                        "duration": asset.duration,
                        "creationDate": asset.creationDate?.timeIntervalSince1970 ?? 0
                    ]
                    videosList.append(videoInfo)
                }
            }
        }
        }

        videoProcessingGroup.notify(queue: .main) {
            completion(videosList)
        }
    }

    @objc
    func getMediaByFolder(_ params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        PHPhotoLibrary.requestAuthorization { status in
            guard status == .authorized || status == .limited else {
                reject("PERMISSION_DENIED", "Photo Library access denied", nil)
                return
            }
    
            let first = params["first"] as? Int ?? 25
            let after = params["after"] as? String
            let folderIdentifier = params["folderPath"] as? String
    
            var mediaList: [[String: Any]] = []
            let fetchOptions = PHFetchOptions()
            fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
    
            var predicates: [NSPredicate] = [
                NSPredicate(format: "mediaType == %d OR mediaType == %d", PHAssetMediaType.image.rawValue, PHAssetMediaType.video.rawValue)
            ]
    
            if let after = after, let afterDate = self.getMediaCreationDate(from: after) {
                predicates.append(NSPredicate(format: "creationDate < %@", afterDate as NSDate))
            }
            fetchOptions.predicate = NSCompoundPredicate(andPredicateWithSubpredicates: predicates)
    
            if let folderIdentifier = folderIdentifier, !folderIdentifier.isEmpty {
                // **Fetch media from a specific folder**
                let collections = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [folderIdentifier], options: nil)
                if collections.count == 0 {
                    reject("ALBUM_NOT_FOUND", "No album found with given identifier", nil)
                    return
                }
    
                collections.enumerateObjects { (collection, _, _) in
                    let assets = PHAsset.fetchAssets(in: collection, options: fetchOptions)
                    print("Album: \(collection.localizedTitle ?? "Unknown"), Found \(assets.count) media items")
    
                    self.processMediaAssets(assets, first: first) { processedMedia in
                        mediaList.append(contentsOf: processedMedia)
                        DispatchQueue.main.async {
                            resolve(self.formatMediaResponse(mediaList, first: first))
                        }
                    }
                }
            } else {
                // **Fetch all media if no folder is specified**
                let assets = PHAsset.fetchAssets(with: fetchOptions)
                print("Fetching all media: Found \(assets.count) media items")
    
                self.processMediaAssets(assets, first: first) { processedMedia in
                    mediaList.append(contentsOf: processedMedia)
                    DispatchQueue.main.async {
                        resolve(self.formatMediaResponse(mediaList, first: first))
                    }
                }
            }
        }
    }

    /// **Helper function to get creationDate from an asset localIdentifier**
    func getMediaCreationDate(from identifier: String) -> Date? {
        let assets = PHAsset.fetchAssets(withLocalIdentifiers: [identifier], options: nil)
        return assets.firstObject?.creationDate
    }

    /// **Helper function to format response with pagination info**
    func formatMediaResponse(_ mediaList: [[String: Any]], first: Int) -> [String: Any] {
        return [
            "media": mediaList,
            "page_info": [
                "has_next_page": mediaList.count == first,
                "start_cursor": mediaList.first?["localIdentifier"] as? String ?? "",
                "end_cursor": mediaList.last?["localIdentifier"] as? String ?? ""
            ]
        ]
    }

    /// **Processes media assets (images & videos) and extracts metadata**
    func processMediaAssets(_ assets: PHFetchResult<PHAsset>, first: Int, completion: @escaping ([[String: Any]]) -> Void) {
        var mediaList: [[String: Any]] = []
        let imageManager = PHImageManager.default()
        let imageOptions = PHImageRequestOptions()
        imageOptions.isSynchronous = true
        imageOptions.deliveryMode = .highQualityFormat
        imageOptions.isNetworkAccessAllowed = true

        let videoOptions = PHVideoRequestOptions()
        videoOptions.deliveryMode = .fastFormat

        var count = 0
        let mediaProcessingGroup = DispatchGroup()

        assets.enumerateObjects { (asset, _, stop) in
            guard count < first else {
                stop.pointee = true
                return
            }

            var mediaName = "Unknown"
            let resources = PHAssetResource.assetResources(for: asset)
            if let resource = resources.first {
                mediaName = resource.originalFilename
            }

            let fileExtension = (mediaName as NSString).pathExtension.lowercased()
            let isVideo = asset.mediaType == .video
            let mimeType = isVideo ? "video/mp4" : (fileExtension == "png" ? "image/png" : "image/jpeg")

            mediaProcessingGroup.enter()

            if isVideo {
                // **Process Video**
                imageManager.requestAVAsset(forVideo: asset, options: videoOptions) { avAsset, _, _ in
                    defer { mediaProcessingGroup.leave() }

                    if let urlAsset = avAsset as? AVURLAsset {
                        let videoInfo: [String: Any] = [
                            "localIdentifier": asset.localIdentifier,
                            "filename": mediaName,
                            "width": asset.pixelWidth,
                            "height": asset.pixelHeight,
                            "mime": mimeType,
                            "path": urlAsset.url.absoluteString,
                            "size": NSNull(), // Video size is not directly available
                            "sourceURL": urlAsset.url.absoluteString,
                            "modificationDate": asset.modificationDate?.timeIntervalSince1970 ?? 0,
                            "creationDate": asset.creationDate?.timeIntervalSince1970 ?? 0,
                            "duration": asset.duration
                        ]
                        mediaList.append(videoInfo)
                        count += 1
                    }
                }
            } else {
                // **Process Image**
                imageManager.requestImageDataAndOrientation(for: asset, options: imageOptions) { data, _, _, _ in
                    defer { mediaProcessingGroup.leave() }

                    guard let data = data else { return }

                    let tempPath = NSTemporaryDirectory() + mediaName
                    try? data.write(to: URL(fileURLWithPath: tempPath))

                    let imageInfo: [String: Any] = [
                        "localIdentifier": asset.localIdentifier,
                        "filename": mediaName,
                        "width": asset.pixelWidth,
                        "height": asset.pixelHeight,
                        "mime": mimeType,
                        "path": tempPath,
                        "size": data.count,
                        "sourceURL": "file://\(tempPath)",
                        "modificationDate": asset.modificationDate?.timeIntervalSince1970 ?? 0,
                        "creationDate": asset.creationDate?.timeIntervalSince1970 ?? 0,
                        "duration": NSNull()
                    ]
                    mediaList.append(imageInfo)
                    count += 1
                }
            }
        }

        mediaProcessingGroup.notify(queue: .main) {
            completion(mediaList)
        }
    }



    @objc
    func getImageFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
            guard status == .authorized || status == .limited else {
                reject("PERMISSION_DENIED", "Photo Library access denied", nil)
                return
            }

            var albumsArray: [[String: Any]] = []
            var seenAlbums = Set<String>()
            let fetchOptions = PHFetchOptions()
            fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue) // ✅ Only fetch images

            let albumTypes: [PHAssetCollectionType] = [.album, .smartAlbum]
            let dispatchGroup = DispatchGroup()

            for albumType in albumTypes {
                let collections = PHAssetCollection.fetchAssetCollections(with: albumType, subtype: .any, options: nil)

                collections.enumerateObjects { (collection, _, _) in
                    let albumName = collection.localizedTitle ?? "Untitled Album"
                    let albumIdentifier = collection.localIdentifier

                    let imageAssets = PHAsset.fetchAssets(in: collection, options: fetchOptions) // ✅ Fetch only images
                    let imageCount = imageAssets.count

                    if imageCount > 0 && !seenAlbums.contains(albumIdentifier) {
                        seenAlbums.insert(albumIdentifier)

                        var albumInfo: [String: Any] = [
                            "folderPath": "",
                            "folderIdentifier": albumIdentifier,
                            "folderName": albumName,
                            "imageCount": imageCount,
                            "thumbnail": ""
                        ]

                        if let firstAsset = imageAssets.firstObject {
                            dispatchGroup.enter()

                            let imageManager = PHImageManager.default()
                            let imageRequestOptions = PHImageRequestOptions()
                            imageRequestOptions.isSynchronous = false
                            imageRequestOptions.deliveryMode = .highQualityFormat

                            imageManager.requestImage(for: firstAsset, targetSize: CGSize(width: 200, height: 200), contentMode: .aspectFill, options: imageRequestOptions) { image, _ in
                                if let image = image, let imageData = image.jpegData(compressionQuality: 0.8) {
                                    let tempDirectory = FileManager.default.temporaryDirectory
                                    let fileURL = tempDirectory.appendingPathComponent("\(UUID().uuidString).jpg")

                                    do {
                                        try imageData.write(to: fileURL)
                                        albumInfo["thumbnail"] = fileURL.absoluteString
                                    } catch {
                                        print("Failed to save thumbnail: \(error)")
                                    }
                                }

                                albumsArray.append(albumInfo)
                                dispatchGroup.leave()
                            }
                        } else {
                            albumsArray.append(albumInfo)
                        }
                    }
                }
            }

            dispatchGroup.notify(queue: .main) {
                resolve(albumsArray)
            }
        }
    }

    @objc
    func getVideoFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
            guard status == .authorized || status == .limited else {
                reject("PERMISSION_DENIED", "Photo Library access denied", nil)
                return
            }
    
            var videoFolders: [[String: Any]] = []
            var seenAlbums = Set<String>()
            let fetchOptions = PHFetchOptions()
            fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)
            let albumTypes: [PHAssetCollectionType] = [.album, .smartAlbum]
            let dispatchGroup = DispatchGroup()
    
            for albumType in albumTypes {
                let albums = PHAssetCollection.fetchAssetCollections(with: albumType, subtype: .any, options: nil)
    
                albums.enumerateObjects { (album, _, _) in
                    let albumIdentifier = album.localIdentifier
                    let albumName = album.localizedTitle ?? "Unknown Album"
                    let albumFetchOptions = PHFetchOptions()
                    albumFetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)
    
                    let videoAssetsInAlbum = PHAsset.fetchAssets(in: album, options: albumFetchOptions)
                    let videoCount = videoAssetsInAlbum.count
    
                    if videoCount > 0 && !seenAlbums.contains(albumIdentifier) {
                        seenAlbums.insert(albumIdentifier)
    
                        var albumInfo: [String: Any] = [
                            "folderIdentifier": albumIdentifier,
                            "folderName": albumName,
                            "videoCount": videoCount,
                            "thumbnail": ""
                        ]
    
                        if let firstVideo = videoAssetsInAlbum.firstObject {
                            dispatchGroup.enter()
    
                            let options = PHVideoRequestOptions()
                            options.deliveryMode = .highQualityFormat
    
                            PHImageManager.default().requestAVAsset(forVideo: firstVideo, options: options) { (avAsset, _, _) in
                                if let asset = avAsset as? AVURLAsset {
                                    albumInfo["thumbnail"] = asset.url.absoluteString
                                }
    
                                videoFolders.append(albumInfo)
                                dispatchGroup.leave()
                            }
                        } else {
                            videoFolders.append(albumInfo)
                        }
                    }
                }
            }
    
            dispatchGroup.notify(queue: .main) {
                resolve(videoFolders)
            }
        }
    }

    @objc
    func getMediaFolders(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
        guard status == .authorized || status == .limited else {
            reject("PERMISSION_DENIED", "Photo Library access denied", nil)
            return
        }

        var albumsArray: [[String: Any]] = []
        var seenAlbums = Set<String>()
        let fetchOptions = PHFetchOptions()
        fetchOptions.predicate = NSPredicate(format: "mediaType == %d OR mediaType == %d", PHAssetMediaType.image.rawValue, PHAssetMediaType.video.rawValue)

        let albumTypes: [PHAssetCollectionType] = [.album, .smartAlbum]
        let dispatchGroup = DispatchGroup()

        for albumType in albumTypes {
            let collections = PHAssetCollection.fetchAssetCollections(with: albumType, subtype: .any, options: nil)
            
            collections.enumerateObjects { (collection, _, _) in
                let albumName = collection.localizedTitle ?? "Untitled Album"
                let albumIdentifier = collection.localIdentifier
                
                let mediaAssets = PHAsset.fetchAssets(in: collection, options: fetchOptions)
                let mediaCount = mediaAssets.count
                
                if mediaCount > 0 && !seenAlbums.contains(albumIdentifier) {
                    seenAlbums.insert(albumIdentifier)
                    
                    var albumInfo: [String: Any] = [
                        "folderPath": "",
                        "folderIdentifier": albumIdentifier,
                        "folderName": albumName,
                        "mediaCount": mediaCount,
                        "thumbnail": ""
                    ]
                    
                    if let firstAsset = mediaAssets.firstObject {
                        dispatchGroup.enter()
                        
                        let imageManager = PHImageManager.default()
                        
                        if firstAsset.mediaType == .image {
                            print("📸 Processing image for album: \(albumName)")
                            let imageRequestOptions = PHImageRequestOptions()
                            imageRequestOptions.isSynchronous = false
                            imageRequestOptions.deliveryMode = .highQualityFormat
                            
                            imageManager.requestImage(for: firstAsset, targetSize: CGSize(width: 200, height: 200), contentMode: .aspectFill, options: imageRequestOptions) { image, _ in
                                if let image = image, let imageData = image.jpegData(compressionQuality: 0.8) {
                                    let tempDirectory = FileManager.default.temporaryDirectory
                                    let fileURL = tempDirectory.appendingPathComponent("\(UUID().uuidString).jpg")
                                    
                                    do {
                                        try imageData.write(to: fileURL)
                                        albumInfo["thumbnail"] = fileURL.absoluteString
                                        print("✅ Thumbnail saved for \(albumName): \(fileURL.absoluteString)")
                                    } catch {
                                        print("❌ Failed to save image thumbnail: \(error)")
                                    }
                                } else {
                                    print("⚠️ No image retrieved for \(albumName)")
                                }
                                dispatchGroup.leave()
                            }
                        } else if firstAsset.mediaType == .video {
                            print("🎥 Processing video for album: \(albumName)")
                            let videoRequestOptions = PHVideoRequestOptions()
                            videoRequestOptions.deliveryMode = .highQualityFormat
                            
                            imageManager.requestAVAsset(forVideo: firstAsset, options: videoRequestOptions) { (avAsset, _, _) in
                                if let urlAsset = avAsset as? AVURLAsset {
                                    albumInfo["thumbnail"] = urlAsset.url.absoluteString
                                    print("✅ Thumbnail (video) saved for \(albumName): \(urlAsset.url.absoluteString)")
                                } else {
                                    print("⚠️ No video retrieved for \(albumName)")
                                }
                                dispatchGroup.leave()
                            }
                        }
                    }

                    dispatchGroup.enter()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { 
                        albumsArray.append(albumInfo)
                        dispatchGroup.leave()
                    }
                }
            }
        }

        dispatchGroup.notify(queue: .main) {
            print("🚀 Final albumsArray: \(albumsArray)")
            resolve(albumsArray)
        }
        }
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

}