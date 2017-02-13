//
//  ReactNativeNavigationController.h
//  blog
//
//  Created by muhaibao on 17/2/3.
//  Copyright © 2017年 muhaibao. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ReactNativeViewController.h"

@interface ReactNativeNavigationController : UINavigationController

@property (nonatomic,strong) NSDictionary *route;

@end
