import { EventSystem } from '../Libs/EventSystem';
import { useDialog, useMessage, useNotification } from 'naive-ui';
import { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
import { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider';
import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';

class Preload extends EventSystem {
    public message!: MessageApiInjection;

    public dialog!: DialogApiInjection;

    public notification!: NotificationApiInjection;

    public Run() {
        this.CreateNaive();
    }

    private CreateNaive() {
        this.message = useMessage();
        this.dialog = useDialog();
        this.notification = useNotification();
    }
}

const PreloadInstance = new Preload();

export { PreloadInstance as Preload };
