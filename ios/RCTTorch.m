//
//  RCTTorch.m
//  foodify
//
//  Created by Govinda Biswas on 26/12/24.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "RCTTorch.h"

@implementation RCTTorch

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(switchState:(BOOL *)newState)
{
    if ([AVCaptureDevice class]) {
        AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        if ([device hasTorch]){
            [device lockForConfiguration:nil];

            if (newState) {
                [device setTorchMode:AVCaptureTorchModeOn];
            } else {
                [device setTorchMode:AVCaptureTorchModeOff];
            }

            [device unlockForConfiguration];
        }
    }
}

@end
