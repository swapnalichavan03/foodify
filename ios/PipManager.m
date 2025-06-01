//
//  PipManager.m
//  foodify
//
//  Created by Govinda Biswas on 26/12/24.
//

#import <Foundation/Foundation.h>
#import <AVKit/AVKit.h>
#import <AVFoundation/AVFoundation.h>
#import "PipManager.h"

@implementation PipManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startPictureInPicture:(NSString *)videoUrl)
{
    // Create AVPlayer with the video URL
    NSURL *url = [NSURL URLWithString:videoUrl];
    AVPlayer *player = [AVPlayer playerWithURL:url];
    AVPlayerViewController *playerViewController = [[AVPlayerViewController alloc] init];
    playerViewController.player = player;
    
    // Enable PIP
    playerViewController.allowsPictureInPicturePlayback = YES;
    
    // Present the video player
    UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    [rootViewController presentViewController:playerViewController animated:YES completion:nil];
}

@end
