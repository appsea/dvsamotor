/*
In NativeScript, the application.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "@nativescript/core/application";
import { isAndroid } from "@nativescript/core/platform";
import * as frame from "@nativescript/core/ui/frame";
import * as purchase from "nativescript-purchase";

require("~/utils/converters");

purchase.init([
    "dvsa.motorcycle.theory.premium"
]);

if (isAndroid) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: application.AndroidActivityBackPressedEventData) => {
        const page = frame.topmost().currentPage;
        if (page != null && page.hasListeners(application.AndroidApplication.activityBackPressedEvent)) {
            (<any>args).page = page;
            page.notify(args);
        }
    });
}

application.on(application.uncaughtErrorEvent, (args) => {
    if (args.android) {
        console.error(args.android);
    } else if (args.ios) {
        console.error(args.ios);
    }
});

application.run({moduleName: "app-root/app-root"});
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
