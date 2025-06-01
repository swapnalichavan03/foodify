// #import <React/RCTBridgeModule.h>

// @interface RCT_EXTERN_MODULE(ImageFolders, NSObject)

// RCT_EXTERN_METHOD(getImagesByFolder:(NSString *)folderPath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// @end

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ImageFolders, NSObject)
RCT_EXTERN_METHOD(getImageFolders:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// RCT_EXTERN_METHOD(getImagesByFolder:(NSString *)folderPath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getImagesByFolder:(NSDictionary *)params resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(getVideoFolders:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// RCT_EXTERN_METHOD(getVideosByFolder:(NSString *)folderPath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getVideosByFolder:(NSDictionary *)params resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getMediaFolders:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
// RCT_EXTERN_METHOD(getVideosByFolder:(NSString *)folderPath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getMediaByFolder:(NSDictionary *)params resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)


 @end

