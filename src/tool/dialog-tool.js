import { Dialog } from 'quasar'
import NotifyTool from '@/tool/notify-tool'

function showDialog(title = '提示', message = '这是一个提示信息') {
  Dialog.create({
    title: title,
    message: message,
    style: 'min-width: 50vw;max-width: 96vw; white-space: pre-wrap;max-height: 80vh;overflow-y: auto;',
    ok: {
      label: 'Copy',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
    },
    persistent: true,
  })
    .onOk(() => {
      // Copy the message to clipboard
      navigator.clipboard.writeText(message).then(() => {
        NotifyTool.showNotification('Message copied to clipboard', 'positive', 'top');
        console.log('Message copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    })
    .onCancel(() => {
      // console.log('Dialog canceled');
    })
    .onDismiss(() => {
      // console.log('Dialog dismissed');
    });
}

const DialogTool = {
  showDialog,
}

export default DialogTool
