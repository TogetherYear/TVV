import { EventSystem } from "../Libs/EventSystem"
import { useDialog, useMessage, useNotification } from "naive-ui"
import { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider"
import { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider"
import { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider"

class Preload extends EventSystem {
    private message: MessageApiInjection | null = null

    private dialog: DialogApiInjection | null = null

    private notification: NotificationApiInjection | null = null

    public Run() {
        this.CreateNaive()
    }

    private CreateNaive() {
        if (!window.Message) {
            this.message = useMessage();
            (window as any).Message = this.message
        }
        if (!window.Dialog) {
            this.dialog = useDialog();
            (window as any).Dialog = this.dialog
        }
        if (!window.Noti) {
            this.notification = useNotification();
            (window as any).Noti = this.notification
        }
    }
}

const PreloadInstance = new Preload()

export { PreloadInstance as Preload }