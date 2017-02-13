//
//  Navigator.m
//  blog
//
//  Created by muhaibao on 16/10/25.
//  Copyright © 2016年 muhaibao. All rights reserved.
//

#import "Navigator.h"
#import "RCTBridge.h"
#import "ReactNativeNavigationController.h"

@implementation Navigator

RCT_EXPORT_MODULE()

// 原生导航push
RCT_EXPORT_METHOD(push:(NSDictionary *)VC){
    dispatch_async(dispatch_get_main_queue(), ^{
        ReactNativeNavigationController *nv = (ReactNativeNavigationController *)[UIApplication sharedApplication].keyWindow.rootViewController;
        
        // 显示原生的状态栏和导航
        [[UIApplication sharedApplication] setStatusBarHidden:NO];
        [nv setNavigationBarHidden:NO];
        
        // 参数挂在导航vc下
        nv.route = [NSDictionary dictionary];
        nv.route = @{@"params": VC[@"params"]};
        
        [nv pushViewController:[[NSClassFromString(VC[@"component"]) alloc] init] animated:YES];
    });
}

// 原生导航pop
RCT_EXPORT_METHOD(pop){
    dispatch_async(dispatch_get_main_queue(), ^{
        ReactNativeNavigationController *nv = (ReactNativeNavigationController *)[UIApplication sharedApplication].keyWindow.rootViewController;
        
        // 显示原生的状态栏和导航
        [[UIApplication sharedApplication] setStatusBarHidden:NO];
        [nv setNavigationBarHidden:NO];
        
        [nv popViewControllerAnimated:YES];
    });
}

@end
