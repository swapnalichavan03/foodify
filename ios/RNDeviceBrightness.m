//
//  RNDeviceBrightness.m
//  foodify
//
//  Created by Govinda Biswas on 26/12/24.
//

#import <Foundation/Foundation.h>
#import "RNDeviceBrightness.h"

@implementation RNDeviceBrightness

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setBrightnessLevel:(float)brightnessLevel)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIScreen mainScreen].brightness = brightnessLevel;
    });
}

RCT_REMAP_METHOD(getBrightnessLevel,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([UIScreen mainScreen].brightness));
}

@end
