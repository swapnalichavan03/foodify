// package com.foodify

// import android.database.Cursor
// import android.os.Build
// import android.provider.MediaStore
// import com.facebook.react.bridge.*
// import java.io.File

// class ImageFoldersModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
//     override fun getName(): String {
//         return "ImageFolders"
//     }

//     @ReactMethod
//     fun getImageFolders(promise: Promise) {
//         val foldersSet = HashSet<String>()
//         val projection = arrayOf(MediaStore.Images.Media.DATA)
//         val uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI

//         val selection: String? = null
//         val selectionArgs: Array<String>? = null
//         val sortOrder: String? = null

//         val cursor: Cursor? = reactApplicationContext.contentResolver.query(
//             uri, projection, selection, selectionArgs, sortOrder
//         )

//         cursor?.use {
//             val columnIndex = it.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)

//             while (it.moveToNext()) {
//                 val filePath = it.getString(columnIndex)
//                 val folderPath = File(filePath).parentFile?.absolutePath
//                 if (folderPath != null) {
//                     foldersSet.add(folderPath)
//                 }
//             }
//         }

//         cursor?.close()

//         // Convert the set to a ReadableNativeArray
//         val readableArray = WritableNativeArray()
//         foldersSet.forEach {
//             readableArray.pushString(it)
//         }

//         promise.resolve(readableArray) // Return the result as a promise
//     }
// }



package com.foodify

import android.database.Cursor
import android.provider.MediaStore
import com.facebook.react.bridge.*
import java.io.File
import android.net.Uri
import android.util.Log
import android.content.Context
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableNativeMap;


import android.app.Activity
import android.graphics.BitmapFactory
import android.media.ExifInterface
import com.facebook.react.bridge.WritableMap

import android.content.ContentUris
import android.os.Environment

class ImageFoldersModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "ImageFolders"
    }

    @ReactMethod
    fun getImageFolders(promise: Promise) {
        val foldersMap = HashMap<String, Pair<Int, String>>() // Map to store folder path, image count, and first image path
        val projection = arrayOf(MediaStore.Images.Media.DATA)
        val uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
    
        val cursor: Cursor? = reactApplicationContext.contentResolver.query(
            uri, projection, null, null, "${MediaStore.Images.Media.DATE_MODIFIED} DESC"
        )
    
        cursor?.use {
            val columnIndex = it.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
    
            while (it.moveToNext()) {
                val filePath = it.getString(columnIndex)
                val folderFile = File(filePath).parentFile
                val folderPath = folderFile?.absolutePath ?: continue
    
                val (count, firstImagePath) = foldersMap.getOrDefault(folderPath, Pair(0, ""))
    
                // Update folder info (store the first image path only if not set)
                foldersMap[folderPath] = Pair(count + 1, if (firstImagePath.isEmpty()) filePath else firstImagePath)
            }
        }
    
        cursor?.close()
    
        // Convert to WritableArray
        val folderArray = WritableNativeArray()
        for ((folderPath, data) in foldersMap) {
            val (imageCount, firstImagePath) = data
    
            val folderObject = WritableNativeMap()
            folderObject.putString("folderPath", folderPath)
            folderObject.putString("folderName", File(folderPath).name)
            folderObject.putInt("imageCount", imageCount)
            folderObject.putString("thumbnail", "file://$firstImagePath") // Set thumbnail
    
            folderArray.pushMap(folderObject)
        }
    
        promise.resolve(folderArray) // Return the result to React Native
    }

    @ReactMethod
    fun getVideoFolders(promise: Promise) {
        val foldersMap = HashMap<String, Pair<Int, String>>() // Store folder path, video count, and first video path
        val projection = arrayOf(MediaStore.Video.Media.DATA)
        val uri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI

        val cursor: Cursor? = reactApplicationContext.contentResolver.query(
            uri, projection, null, null, "${MediaStore.Video.Media.DATE_MODIFIED} DESC"
        )

        cursor?.use {
            val columnIndex = it.getColumnIndexOrThrow(MediaStore.Video.Media.DATA)

            while (it.moveToNext()) {
                val filePath = it.getString(columnIndex)
                val folderFile = File(filePath).parentFile
                val folderPath = folderFile?.absolutePath ?: continue

                val (count, firstVideoPath) = foldersMap.getOrDefault(folderPath, Pair(0, ""))

                // Update folder info (store the first video path only if not set)
                foldersMap[folderPath] = Pair(count + 1, if (firstVideoPath.isEmpty()) filePath else firstVideoPath)
            }
        }

        cursor?.close()

        // Convert to WritableArray
        val folderArray = WritableNativeArray()
        for ((folderPath, data) in foldersMap) {
            val (videoCount, firstVideoPath) = data

            val folderObject = WritableNativeMap()
            folderObject.putString("folderPath", folderPath)
            folderObject.putString("folderName", File(folderPath).name)
            folderObject.putInt("videoCount", videoCount)
            folderObject.putString("thumbnail", "file://$firstVideoPath") // Set thumbnail

            folderArray.pushMap(folderObject)
        }

        promise.resolve(folderArray) // Return the result to React Native
    }

    @ReactMethod
    fun getMediaFolders(promise: Promise) {
        val foldersMap = HashMap<String, Triple<Int, String, Boolean>>() // Map to store folder path, media count, first media path, and type
        val projection = arrayOf(MediaStore.Files.FileColumns.DATA, MediaStore.Files.FileColumns.MEDIA_TYPE)
        val uri = MediaStore.Files.getContentUri("external")
        val selection = "${MediaStore.Files.FileColumns.MEDIA_TYPE}=? OR ${MediaStore.Files.FileColumns.MEDIA_TYPE}=?"
        val selectionArgs = arrayOf(
            MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE.toString(),
            MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO.toString()
        )

        val cursor: Cursor? = reactApplicationContext.contentResolver.query(
            uri, projection, selection, selectionArgs, "${MediaStore.Files.FileColumns.DATE_MODIFIED} DESC"
        )

        cursor?.use {
        val columnIndex = it.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DATA)
        val mediaTypeIndex = it.getColumnIndexOrThrow(MediaStore.Files.FileColumns.MEDIA_TYPE)

        while (it.moveToNext()) {
            val filePath = it.getString(columnIndex)
            val mediaType = it.getInt(mediaTypeIndex)
            val folderFile = File(filePath).parentFile
            val folderPath = folderFile?.absolutePath ?: continue

            val (count, firstMediaPath, isVideo) = foldersMap.getOrDefault(folderPath, Triple(0, "", false))

            foldersMap[folderPath] = Triple(
                count + 1, 
                if (firstMediaPath.isEmpty()) filePath else firstMediaPath, 
                isVideo || (mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO)
            )
        }
        }

        cursor?.close()

        // Convert to WritableArray
        val folderArray = WritableNativeArray()
        for ((folderPath, data) in foldersMap) {
        val (mediaCount, firstMediaPath, isVideo) = data

        val folderObject = WritableNativeMap()
        folderObject.putString("folderPath", folderPath)
        folderObject.putString("folderName", File(folderPath).name)
        folderObject.putInt("mediaCount", mediaCount)
        folderObject.putString("thumbnail", "file://$firstMediaPath") // Set thumbnail
        folderObject.putBoolean("isVideo", isVideo) // Indicate if the folder contains videos

        folderArray.pushMap(folderObject)
        }

        promise.resolve(folderArray) // Return the result to React Native
    }


    /** 
    @ReactMethod
    fun getImagesByFolder(folderPath: String?, promise: Promise) {
        val imagesList: WritableArray = Arguments.createArray()
        val contentResolver = currentActivity?.contentResolver

        val projection = arrayOf(
            MediaStore.Images.Media._ID,
            MediaStore.Images.Media.DATA,
            MediaStore.Images.Media.MIME_TYPE,
            MediaStore.Images.Media.SIZE,
            MediaStore.Images.Media.DATE_MODIFIED,
            MediaStore.Images.Media.WIDTH,
            MediaStore.Images.Media.HEIGHT,
            MediaStore.Images.Media.BUCKET_ID,
            MediaStore.Images.Media.BUCKET_DISPLAY_NAME
        )

        val selection: String?
        val selectionArgs: Array<String>?

        if (folderPath.isNullOrEmpty()) {
            // If folderPath is null/undefined, fetch all images from the device
            selection = null
            selectionArgs = null
        } else {
            // Get BUCKET_ID for the given folder
            val bucketId = folderPath.lowercase().hashCode().toString()
            selection = "${MediaStore.Images.Media.BUCKET_ID} = ?"
            selectionArgs = arrayOf(bucketId)
        }

        val cursor = contentResolver?.query(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
            projection,
            selection,
            selectionArgs,
            "${MediaStore.Images.Media.DATE_MODIFIED} DESC"
        )

        cursor?.use {
            val columnIndexId = it.getColumnIndex(MediaStore.Images.Media._ID)
            val columnIndexData = it.getColumnIndex(MediaStore.Images.Media.DATA)
            val columnIndexMimeType = it.getColumnIndex(MediaStore.Images.Media.MIME_TYPE)
            val columnIndexSize = it.getColumnIndex(MediaStore.Images.Media.SIZE)
            val columnIndexDateModified = it.getColumnIndex(MediaStore.Images.Media.DATE_MODIFIED)
            val columnIndexWidth = it.getColumnIndex(MediaStore.Images.Media.WIDTH)
            val columnIndexHeight = it.getColumnIndex(MediaStore.Images.Media.HEIGHT)
            val columnIndexBucketDisplayName = it.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME)

            while (it.moveToNext()) {
                val imageId = it.getLong(columnIndexId)
                val filePath = it.getString(columnIndexData)
                val mimeType = it.getString(columnIndexMimeType)
                val size = it.getLong(columnIndexSize)
                val modificationDate = it.getLong(columnIndexDateModified) * 1000
                val width = it.getInt(columnIndexWidth)
                val height = it.getInt(columnIndexHeight)
                val bucketDisplayName = it.getString(columnIndexBucketDisplayName)

                val uri = Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, imageId.toString())

                val image = Arguments.createMap()
                image.putString("filename", File(filePath).name)
                image.putString("path", "file://$filePath")
                image.putString("mime", mimeType)
                image.putDouble("size", size.toDouble())
                image.putDouble("modificationDate", modificationDate.toDouble())
                image.putInt("width", width)
                image.putInt("height", height)
                image.putString("uri", uri.toString())

                imagesList.pushMap(image)
            }
        }

        cursor?.close()
        promise.resolve(imagesList)
    }
    */

    @ReactMethod
    fun getImagesByFolder(params: ReadableMap, promise: Promise) {
        val imagesList: WritableArray = Arguments.createArray()
        val contentResolver = currentActivity?.contentResolver

        val folderPath = params.getString("folderPath")?.takeIf { it.isNotEmpty() }
        val first = if (params.hasKey("first")) params.getInt("first") else 25
        val after = params.getString("after")?.takeIf { it.isNotEmpty() }

        val projection = arrayOf(
            MediaStore.Images.Media._ID,
            MediaStore.Images.Media.DATA,
            MediaStore.Images.Media.MIME_TYPE,
            MediaStore.Images.Media.SIZE,
            MediaStore.Images.Media.DATE_MODIFIED,
            MediaStore.Images.Media.WIDTH,
            MediaStore.Images.Media.HEIGHT,
            MediaStore.Images.Media.BUCKET_ID,
            MediaStore.Images.Media.BUCKET_DISPLAY_NAME
        )

        val selectionArgsList = mutableListOf<String>()
        var selection: String? = null

        // Filter by folderPath (BUCKET_ID)
        if (!folderPath.isNullOrEmpty()) {
            val bucketId = folderPath.lowercase().hashCode().toString()
            selection = "${MediaStore.Images.Media.BUCKET_ID} = ?"
            selectionArgsList.add(bucketId)
        }

        // Pagination (only fetch items after the given ID)
        if (!after.isNullOrEmpty()) {
            selection = if (selection.isNullOrEmpty()) {
                "${MediaStore.Images.Media._ID} < ?"
            } else {
                "$selection AND ${MediaStore.Images.Media._ID} < ?"
            }
            selectionArgsList.add(after)
        }

        val selectionArgs = if (selectionArgsList.isNotEmpty()) selectionArgsList.toTypedArray() else null
        val sortOrder = "${MediaStore.Images.Media.DATE_MODIFIED} DESC"

        val cursor = contentResolver?.query(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
            projection,
            selection,
            selectionArgs,
            sortOrder
        )

        var startCursor: String? = null
        var endCursor: String? = null
        var count = 0

        cursor?.use {
            val columnIndexId = it.getColumnIndex(MediaStore.Images.Media._ID)
            val columnIndexData = it.getColumnIndex(MediaStore.Images.Media.DATA)
            val columnIndexMimeType = it.getColumnIndex(MediaStore.Images.Media.MIME_TYPE)
            val columnIndexSize = it.getColumnIndex(MediaStore.Images.Media.SIZE)
            val columnIndexDateModified = it.getColumnIndex(MediaStore.Images.Media.DATE_MODIFIED)
            val columnIndexWidth = it.getColumnIndex(MediaStore.Images.Media.WIDTH)
            val columnIndexHeight = it.getColumnIndex(MediaStore.Images.Media.HEIGHT)
            val columnIndexBucketDisplayName = it.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME)

            var firstImageId: String? = null
            var lastImageId: String? = null

            while (it.moveToNext() && count < first) {
                val imageId = it.getLong(columnIndexId).toString()
                val filePath = it.getString(columnIndexData)
                val mimeType = it.getString(columnIndexMimeType)
                val size = it.getLong(columnIndexSize)
                val modificationDate = it.getLong(columnIndexDateModified) * 1000
                val width = it.getInt(columnIndexWidth)
                val height = it.getInt(columnIndexHeight)
                val bucketDisplayName = it.getString(columnIndexBucketDisplayName)

                val uri = Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, imageId)

                if (firstImageId == null) {
                    firstImageId = imageId
                }
                lastImageId = imageId

                val image = Arguments.createMap().apply {
                    putString("filename", File(filePath).name)
                    putString("path", "file://$filePath")
                    putString("mime", mimeType)
                    putDouble("size", size.toDouble())
                    putDouble("modificationDate", modificationDate.toDouble())
                    putInt("width", width)
                    putInt("height", height)
                    putString("uri", uri.toString())
                }

                imagesList.pushMap(image)
                count++
            }

            startCursor = firstImageId
            endCursor = lastImageId
        }

        cursor?.close()

        val hasNextPage = count == first // If we fetched `first` items, there might be more.

        val pageInfo = Arguments.createMap().apply {
            putBoolean("has_next_page", hasNextPage)
            putString("start_cursor", startCursor)
            putString("end_cursor", endCursor)
        }

        val response = Arguments.createMap().apply {
            putArray("images", imagesList)
            putMap("page_info", pageInfo)
        }

        promise.resolve(response)
    }


    @ReactMethod
    fun getVideosByFolder(params: ReadableMap, promise: Promise) {
        val videosList: WritableArray = Arguments.createArray()
        val contentResolver = currentActivity?.contentResolver
        val folderPath = params.getString("folderPath")?.takeIf { it.isNotEmpty() }
        val first = if (params.hasKey("first")) params.getInt("first") else 25
        val after = params.getString("after")?.takeIf { it.isNotEmpty() }
        val projection = arrayOf(
            MediaStore.Video.Media._ID,
            MediaStore.Video.Media.DATA,
            MediaStore.Video.Media.MIME_TYPE,
            MediaStore.Video.Media.SIZE,
            MediaStore.Video.Media.DATE_MODIFIED,
            MediaStore.Video.Media.WIDTH,
            MediaStore.Video.Media.HEIGHT,
            MediaStore.Video.Media.DURATION,
            MediaStore.Video.Media.BUCKET_ID,
            MediaStore.Video.Media.BUCKET_DISPLAY_NAME
        )

        val selectionArgsList = mutableListOf<String>()
        var selection: String? = null

        // Filter by folderPath (BUCKET_ID)
        if (!folderPath.isNullOrEmpty()) {
            val bucketId = folderPath.lowercase().hashCode().toString()
            selection = "${MediaStore.Video.Media.BUCKET_ID} = ?"
            selectionArgsList.add(bucketId)
        }

        // Pagination (only fetch items after the given ID)
        if (!after.isNullOrEmpty()) {
            selection = if (selection.isNullOrEmpty()) {
                "${MediaStore.Video.Media._ID} < ?"
            } else {
                "$selection AND ${MediaStore.Video.Media._ID} < ?"
            }
            selectionArgsList.add(after)
        }

        val selectionArgs = if (selectionArgsList.isNotEmpty()) selectionArgsList.toTypedArray() else null
        val sortOrder = "${MediaStore.Video.Media.DATE_MODIFIED} DESC"

        val cursor = contentResolver?.query(
            MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
            projection,
            selection,
            selectionArgs,
            sortOrder
        )

        var startCursor: String? = null
        var endCursor: String? = null
        var count = 0

        cursor?.use {
            val columnIndexId = it.getColumnIndex(MediaStore.Video.Media._ID)
            val columnIndexData = it.getColumnIndex(MediaStore.Video.Media.DATA)
            val columnIndexMimeType = it.getColumnIndex(MediaStore.Video.Media.MIME_TYPE)
            val columnIndexSize = it.getColumnIndex(MediaStore.Video.Media.SIZE)
            val columnIndexDateModified = it.getColumnIndex(MediaStore.Video.Media.DATE_MODIFIED)
            val columnIndexWidth = it.getColumnIndex(MediaStore.Video.Media.WIDTH)
            val columnIndexHeight = it.getColumnIndex(MediaStore.Video.Media.HEIGHT)
            val columnIndexDuration = it.getColumnIndex(MediaStore.Video.Media.DURATION)
            val columnIndexBucketDisplayName = it.getColumnIndex(MediaStore.Video.Media.BUCKET_DISPLAY_NAME)

            var firstVideoId: String? = null
            var lastVideoId: String? = null

            while (it.moveToNext() && count < first) {
                val videoId = it.getLong(columnIndexId).toString()
                val filePath = it.getString(columnIndexData)
                val mimeType = it.getString(columnIndexMimeType)
                val size = it.getLong(columnIndexSize)
                val modificationDate = it.getLong(columnIndexDateModified) * 1000
                val width = it.getInt(columnIndexWidth)
                val height = it.getInt(columnIndexHeight)
                val duration = it.getLong(columnIndexDuration)
                val bucketDisplayName = it.getString(columnIndexBucketDisplayName)

                val uri = Uri.withAppendedPath(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, videoId)

                if (firstVideoId == null) {
                    firstVideoId = videoId
                }
                lastVideoId = videoId

                val video = Arguments.createMap().apply {
                    putString("filename", File(filePath).name)
                    putString("path", "file://$filePath")
                    putString("mime", mimeType)
                    putDouble("size", size.toDouble())
                    putDouble("modificationDate", modificationDate.toDouble())  // Make sure modificationDate is converted to Double
                    putInt("width", width)
                    putInt("height", height)
                    putDouble("duration", duration.toDouble())  // Ensure duration is converted to Double
                    putString("uri", uri.toString())
                }

                videosList.pushMap(video)
                count++
            }

            startCursor = firstVideoId
            endCursor = lastVideoId
        }

        cursor?.close()

        val hasNextPage = count == first // If we fetched `first` items, there might be more.

        val pageInfo = Arguments.createMap().apply {
            putBoolean("has_next_page", hasNextPage)
            putString("start_cursor", startCursor)
            putString("end_cursor", endCursor)
        }

        val response = Arguments.createMap().apply {
            putArray("videos", videosList)
            putMap("page_info", pageInfo)
        }

        promise.resolve(response)
    }

    @ReactMethod
    fun getMediaByFolder(params: ReadableMap, promise: Promise) {
        val mediaList: WritableArray = Arguments.createArray()
        val contentResolver = currentActivity?.contentResolver
    
        val folderPath = params.getString("folderPath")?.takeIf { it.isNotEmpty() }
        val first = if (params.hasKey("first")) params.getInt("first") else 25
        val after = params.getString("after")?.takeIf { it.isNotEmpty() }
    
        val projection = arrayOf(
            MediaStore.Files.FileColumns._ID,
            MediaStore.Files.FileColumns.DATA,
            MediaStore.Files.FileColumns.MEDIA_TYPE,
            MediaStore.Files.FileColumns.MIME_TYPE,
            MediaStore.Files.FileColumns.SIZE,
            MediaStore.Files.FileColumns.DATE_MODIFIED,
            MediaStore.Files.FileColumns.WIDTH,
            MediaStore.Files.FileColumns.HEIGHT,
            MediaStore.Files.FileColumns.BUCKET_ID,
            MediaStore.Files.FileColumns.BUCKET_DISPLAY_NAME
        )
    
        val selectionArgsList = mutableListOf<String>()
        var selection: String? = null
    
        // Filter by folderPath (BUCKET_ID)
        if (!folderPath.isNullOrEmpty()) {
            val bucketId = folderPath.lowercase().hashCode().toString()
            selection = "${MediaStore.Files.FileColumns.BUCKET_ID} = ?"
            selectionArgsList.add(bucketId)
        }
    
        // Pagination (only fetch items after the given ID)
        if (!after.isNullOrEmpty()) {
            selection = if (selection.isNullOrEmpty()) {
                "${MediaStore.Files.FileColumns._ID} < ?"
            } else {
                "$selection AND ${MediaStore.Files.FileColumns._ID} < ?"
            }
            selectionArgsList.add(after)
        }
    
        val selectionArgs = if (selectionArgsList.isNotEmpty()) selectionArgsList.toTypedArray() else null
        val sortOrder = "${MediaStore.Files.FileColumns.DATE_MODIFIED} DESC"
    
        val cursor = contentResolver?.query(
            MediaStore.Files.getContentUri("external"),
            projection,
            selection,
            selectionArgs,
            sortOrder
        )
    
        var startCursor: String? = null
        var endCursor: String? = null
        var count = 0
    
        cursor?.use {
            val columnIndexId = it.getColumnIndex(MediaStore.Files.FileColumns._ID)
            val columnIndexData = it.getColumnIndex(MediaStore.Files.FileColumns.DATA)
            val columnIndexMediaType = it.getColumnIndex(MediaStore.Files.FileColumns.MEDIA_TYPE)
            val columnIndexMimeType = it.getColumnIndex(MediaStore.Files.FileColumns.MIME_TYPE)
            val columnIndexSize = it.getColumnIndex(MediaStore.Files.FileColumns.SIZE)
            val columnIndexDateModified = it.getColumnIndex(MediaStore.Files.FileColumns.DATE_MODIFIED)
            val columnIndexWidth = it.getColumnIndex(MediaStore.Files.FileColumns.WIDTH)
            val columnIndexHeight = it.getColumnIndex(MediaStore.Files.FileColumns.HEIGHT)
            val columnIndexBucketDisplayName = it.getColumnIndex(MediaStore.Files.FileColumns.BUCKET_DISPLAY_NAME)
    
            var firstMediaId: String? = null
            var lastMediaId: String? = null
    
            while (it.moveToNext() && count < first) {
                val mediaId = it.getLong(columnIndexId).toString()
                val filePath = it.getString(columnIndexData)
                val mediaType = it.getInt(columnIndexMediaType)
                val mimeType = it.getString(columnIndexMimeType)
                val size = it.getLong(columnIndexSize)
                val modificationDate = it.getLong(columnIndexDateModified) * 1000
                val width = it.getInt(columnIndexWidth)
                val height = it.getInt(columnIndexHeight)
                val bucketDisplayName = it.getString(columnIndexBucketDisplayName)
    
                val uri = if (mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE) {
                    Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, mediaId)
                } else {
                    Uri.withAppendedPath(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaId)
                }
    
                if (firstMediaId == null) {
                    firstMediaId = mediaId
                }
                lastMediaId = mediaId
    
                val media = Arguments.createMap().apply {
                    putString("filename", File(filePath).name)
                    putString("path", "file://$filePath")
                    putString("mime", mimeType)
                    putDouble("size", size.toDouble())
                    putDouble("modificationDate", modificationDate.toDouble())
                    putInt("width", width)
                    putInt("height", height)
                    putString("uri", uri.toString())
                    putBoolean("isVideo", mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO)
                }
    
                mediaList.pushMap(media)
                count++
            }
    
            startCursor = firstMediaId
            endCursor = lastMediaId
        }
    
        cursor?.close()
    
        val hasNextPage = count == first // If we fetched `first` items, there might be more.
    
        val pageInfo = Arguments.createMap().apply {
            putBoolean("has_next_page", hasNextPage)
            putString("start_cursor", startCursor)
            putString("end_cursor", endCursor)
        }
    
        val response = Arguments.createMap().apply {
            putArray("media", mediaList)
            putMap("page_info", pageInfo)
        }
    
        promise.resolve(response)
    }


}
