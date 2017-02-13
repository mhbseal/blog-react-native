//
//  ReactNativeNavigationController.m
//  blog
//
//  Created by muhaibao on 17/2/3.
//  Copyright © 2017年 muhaibao. All rights reserved.
//

#import "ReactNativeNavigationController.h"

@interface ReactNativeNavigationController ()

@end

@implementation ReactNativeNavigationController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated{
    if ([viewController isKindOfClass:[ReactNativeViewController class]]) {
        [[UIApplication sharedApplication] setStatusBarHidden:YES];
        [super setNavigationBarHidden:YES];
    }
    [super pushViewController:viewController animated:animated];
}

- (UIViewController *)popViewControllerAnimated:(BOOL)animated{
    if ([super.viewControllers[super.viewControllers.count-2] isKindOfClass:[ReactNativeViewController class]]) {
        [[UIApplication sharedApplication] setStatusBarHidden:YES];
        [super setNavigationBarHidden:YES];
    }
    [super popViewControllerAnimated:animated];
    return  NULL;
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
