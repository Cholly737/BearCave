import UIKit
import Capacitor
import FirebaseCore
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, MessagingDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        Messaging.messaging().delegate = self
        return true
    }
    
    // Handle successful registration for remote notifications
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // The server sends through FCM, so Capacitor must receive an FCM token,
        // not the raw APNs token. Explicitly map APNs before fetching FCM.
        Messaging.messaging().apnsToken = deviceToken
        Messaging.messaging().token { [weak self] token, error in
            if let error = error {
                self?.reportRegistrationError(error)
            } else if let token = token, !token.isEmpty {
                self?.publishFCMToken(token)
            } else {
                self?.reportRegistrationError(NSError(
                    domain: "BearCavePush",
                    code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "Firebase returned no registration token"]
                ))
            }
        }
    }
    
    // Handle failed registration for remote notifications
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        reportRegistrationError(error)
    }

    // Firebase can rotate the token. Forward refreshes only after APNs is mapped.
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard messaging.apnsToken != nil,
              UIApplication.shared.isRegisteredForRemoteNotifications,
              let token = fcmToken, !token.isEmpty else { return }
        publishFCMToken(token)
    }

    private func publishFCMToken(_ token: String) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: token)
        }
    }

    private func reportRegistrationError(_ error: Error) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
