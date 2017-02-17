//
//  ReactNativeViewController.m
//  blog
//
//  Created by muhaibao on 16/12/1.
//  Copyright © 2016年 muhaibao. All rights reserved.
//

#import "ReactNativeViewController.h"
#import "RCTRootView.h"
#import "ReactNativeNavigationController.h"

@interface ReactNativeViewController ()

@end

@implementation ReactNativeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    NSURL *jsCodeLocation;
    ReactNativeNavigationController *nv =(ReactNativeNavigationController*)self.navigationController;
    
    // 本地DEBUG
//    jsCodeLocation = [NSURL URLWithString: @"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    // 真机or本地 DEBUG
    jsCodeLocation = [NSURL URLWithString: @"http://10.233.72.26:8081/index.ios.bundle?platform=ios&dev=true"];
    // 打包离线
//    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"bundle.ios/index.ios" withExtension:@"jsbundle"];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"ReactNative"
                                                 initialProperties: nv.route ? @{@"route": nv.route} : nil                                                   launchOptions:nil];
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    self.view = rootView;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
