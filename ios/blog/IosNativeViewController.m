//
//  IosNativeViewController.m
//  blog
//
//  Created by muhaibao on 16/10/25.
//  Copyright © 2016年 muhaibao. All rights reserved.
//

#import "IosNativeViewController.h"
#import "ReactNativeViewController.h"
#import "ReactNativeNavigationController.h"

@interface IosNativeViewController ()

@end

@implementation IosNativeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    ReactNativeNavigationController *nv =(ReactNativeNavigationController*)self.navigationController;

    //添加标题
    self.navigationItem.title = @"IosNativeViewController";
    
    
    // 创建按钮
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeRoundedRect]; //绘制形状
    
    // 确定宽、高、X、Y坐标
    CGRect frame;
    frame.size.width = 320;
    frame.size.height = 30;
    frame.origin.x = 0;
    frame.origin.y = 480 / 2 - 30;
    [btn setFrame:frame];
    
    // 设置Tag(整型)
    btn.tag = 10;
    
    // 设置标题
    
    NSMutableString *str = [NSMutableString string];
    [str appendString:@"按钮"];
    if (nv.route[@"params"][@"keyword"]) {
        [str appendString:@"--来自rn的参数："];
        [str appendString:nv.route[@"params"][@"keyword"]];
    };
    
    
    [btn setTitle:str  forState:UIControlStateNormal];
    
    // 设置事件
    [btn addTarget:self action:@selector(btnPressed:) forControlEvents:UIControlEventTouchUpInside];
    
    // 设置背景色和透明度
    [btn setBackgroundColor:[UIColor blackColor]];
    [btn setAlpha:0.8];
    
    // 或设置背景色和透明度
    btn.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.8];
    [self.view addSubview:btn];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

//按钮响应事件
-(void)btnPressed:(id)sender
{
    // 参数挂在导航vc下
    ReactNativeNavigationController *nv =(ReactNativeNavigationController*)self.navigationController;
    nv.route = [NSDictionary dictionary];
    nv.route = @{
                 @"component": @"Search",
                 @"params": @{
                    @"mhbseal": @"name",
                    @"job": @"jser"
                    }
                 };
    
    [self.navigationController pushViewController:[[ReactNativeViewController alloc] init] animated:YES];
}



@end
