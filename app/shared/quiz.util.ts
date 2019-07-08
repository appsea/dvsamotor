import { File, Folder, knownFolders } from "tns-core-modules/file-system";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import * as frame from "tns-core-modules/ui/frame";
import * as utils from "tns-core-modules/utils/utils";
import { IQuestion } from "~/shared/questions.model";

export class QuizUtil {

    static days: Array<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    static months: Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    static getDate() {
        const d = new Date();

        return d.toISOString();
    }

    static getDateString(date: Date): string {
        let dateString: string = "";
        dateString += QuizUtil.days[date.getDay()];
        dateString += " " + QuizUtil.months[date.getMonth()];
        dateString += " " + date.getDate();
        dateString += ", " + date.getHours();
        const minutes: number = date.getMinutes();
        dateString += ":" + (minutes < 10 ? "0" + minutes : minutes);

        return dateString;
    }

    static getRandomNumber(max: number): number {
        const randomNumber = Math.floor(Math.random() * (max));

        return randomNumber;
    }

    static correctImagePath(question: IQuestion) {
        if (question.prashna.image && !question.prashna.image.startsWith("~/images/")) {
            question.prashna.image = "~/images/" + question.prashna.image;
        }
        for (const option of question.options) {
            if (option.image && !option.image.startsWith("~/images/")) {
                option.image = "~/images/" + option.image;
            }
        }
    }

    static exist(relativePath: string): boolean {
        const path: string = relativePath.replace("~", "");
        const currentAppFolder = knownFolders.currentApp();
        const exists = File.exists(currentAppFolder.path + path);

        return exists;
    }

    static hideKeyboard() {
        if (isAndroid) {
            utils.ad.dismissSoftInput();
        } else if (isIOS) {
            frame.topmost().nativeView.endEditing(true);
        }
    }

    static showKeyboard(myTextfield) {
        if (myTextfield.ios) {
            myTextfield.focus();
        }

        if (myTextfield.android) {
            setTimeout(function() {
                myTextfield.android.requestFocus();
                const imm = utils.ad.getInputMethodManager();
                imm.showSoftInput(myTextfield.android, 0);
            }, 300);
        }
    }

    private constructor() {
    }
}
