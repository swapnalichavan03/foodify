/**
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBranch

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "foodify"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
*/

import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import BranchSDK // ✅ Use BranchSDK for import

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    self.moduleName = "foodify"
    self.dependencyProvider = RCTAppDependencyProvider()
    
    // ✅ Initialize Branch Correctly
    Branch.getInstance().initSession(launchOptions: launchOptions)

    self.initialProps = [:]
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    // ✅ Use Branch.getInstance() instead of BranchSDK
    if Branch.getInstance().handleDeepLink(url) {
      return true
    }
    return super.application(app, open: url, options: options)
  }

  override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    if Branch.getInstance().continue(userActivity) {
      return true
    }
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

//import UIKit
//import React
//import React_RCTAppDelegate
//import ReactAppDependencyProvider
//import UserNotifications
//import RNCPushNotificationIOS
//import CodePush
//
//@main
//class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
//  override func application(
//    _ application: UIApplication,
//    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//  ) -> Bool {
//    self.moduleName = "foodify"
//    self.dependencyProvider = RCTAppDependencyProvider()
//    self.initialProps = [:]
//
//    // Configure User Notifications
//    let center = UNUserNotificationCenter.current()
//    center.delegate = self
//
//    // Define notification actions
//    let replyAction = UNTextInputNotificationAction(
//      identifier: "Reply",
//      title: "Reply",
//      options: [],
//      textInputButtonTitle: "Send",
//      textInputPlaceholder: "Type your reply..."
//    )
//
//    let viewAction = UNNotificationAction(
//      identifier: "View",
//      title: "View",
//      options: .foreground
//    )
//
//    let category = UNNotificationCategory(
//      identifier: "DEFAULT_CATEGORY",
//      actions: [replyAction, viewAction],
//      intentIdentifiers: [],
//      options: []
//    )
//
//    center.setNotificationCategories([category])
//    
//    center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
//      if granted {
//        print("Notification permissions granted.")
//      } else {
//        print("Notification permissions denied.")
//      }
//    }
//
//    application.registerForRemoteNotifications()
//
//    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
//  }
//
//  override func sourceURL(for bridge: RCTBridge) -> URL? {
//    return self.bundleURL()
//  }
//
//  override func bundleURL() -> URL? {
//#if DEBUG
//    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
//#else
//    return CodePush.bundleURL()
//#endif
//  }
//
//  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
//    RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
//  }
//
//  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
//    RNCPushNotificationIOS.didFailToRegisterForRemoteNotificationsWithError(error)
//  }
//
//  func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
//    RNCPushNotificationIOS.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
//  }
//
//  // Handle user's response to notifications
//  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
//    if response.actionIdentifier == "Reply" {
//      if let textResponse = response as? UNTextInputNotificationResponse {
//        let userText = textResponse.userText
//        print("User replied: \(userText)")
//      }
//    } else if response.actionIdentifier == "View" {
//      print("User tapped View action")
//    }
//
//    completionHandler()
//    RNCPushNotificationIOS.didReceive(response)
//  }
//
//  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
//    completionHandler([.alert, .sound, .badge])
//  }
//}
//
