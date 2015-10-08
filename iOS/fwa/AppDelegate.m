/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	
	/*
	/// pipe console log to a file, so we can tail it (and keep xcode hidden)
	NSString *logPath =[NSString stringWithFormat:@"/fwa-xcode.log"];
	NSLog(@"Logging to %@", logPath );
	
	freopen([logPath fileSystemRepresentation], "w+", stderr);
	NSLog(@"-----\nLogging to %@", logPath );
	*/
	
	NSURL *jsCodeLocation;

//#ifdef DEBUG

	jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
	//jsCodeLocation = [NSURL URLWithString:@"http://172.20.10.13:8081/index.ios.bundle"];
	//jsCodeLocation = [NSURL URLWithString:@"http://10.0.1.2:8081/index.ios.bundle"];
	//jsCodeLocation = [NSURL URLWithString:@"http://192.168.2.4:8081/index.ios.bundle"];

//#else
	
	/* react-native bundle --minify */
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

//#endif
	
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"fwa"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
